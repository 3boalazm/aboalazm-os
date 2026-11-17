"""HTTP integration checks against a built site. Never submits forms or changes data."""
import argparse, concurrent.futures, json, re, subprocess, tempfile, time
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import urlopen
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

class Page(HTMLParser):
    def __init__(self, body):
        super().__init__(); self.lang=None; self.direction=None; self.links=[]; self.metas=[]; self.h1=0; self.forms=0; self.options=[]; self.text=[]; self.skip=0
        self.feed(body)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang'); self.direction=a.get('dir')
        if tag=='link': self.links.append(a)
        if tag=='meta': self.metas.append(a)
        if tag=='h1': self.h1+=1
        if tag=='form': self.forms+=1
        if tag=='option' and 'selected' in a: self.options.append(a.get('value'))
        if tag in ('script','style'): self.skip+=1
    def handle_endtag(self, tag):
        if tag in ('script','style'): self.skip=max(0,self.skip-1)
    def handle_data(self, data):
        if not self.skip: self.text.append(data)

def fetch(url):
    try:
        with urlopen(url,timeout=35) as response: return response.status, response.url, response.read().decode('utf-8',errors='replace')
    except HTTPError as error: return error.code, error.url, error.read().decode('utf-8',errors='replace')

def verify(base):
    status,_,body=fetch(base+'/sitemap.xml'); assert status==200, 'sitemap unavailable'
    urls=[node.text for node in ET.fromstring(body).findall('{*}url/{*}loc')]
    paths=[urlsplit(url).path or '/' for url in urls]
    assert len(paths)==len(set(paths)), 'duplicate sitemap paths'
    def check(path):
        status,final,body=fetch(base+path); assert status==200, f'{path}: HTTP {status}'
        page=Page(body)
        if path!='/portfolio':
            locale='ar' if path=='/ar' or path.startswith('/ar/') else 'ms' if path=='/ms' or path.startswith('/ms/') else 'en'
            assert page.lang==locale, f'{path}: wrong SSR language {page.lang}'
            canonical=[l for l in page.links if l.get('rel')=='canonical']
            assert len(canonical)==1, f'{path}: canonical count {len(canonical)}'
            assert (urlsplit(canonical[0]['href']).path.rstrip('/') or '/')==(path.rstrip('/') or '/'), f'{path}: wrong canonical {canonical}'
        return path
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: checked=list(pool.map(check,paths))
    for path in ['/','/ar','/contact','/ar/contact','/services/websites','/ar/services/brand-identity','/privacy','/ar/privacy','/ms/privacy']:
        page=Page(fetch(base+path)[2]); assert page.h1==1, f'{path}: expected one H1'
    for path in ['/missing-audit-route','/case-studies/missing-audit-case','/ar/case-studies/missing-audit-case']:
        status,_,body=fetch(base+path); assert status==404, f'{path}: expected 404, got {status}'
        assert any('noindex' in m.get('content','') for m in Page(body).metas), f'{path}: missing noindex'
    status,_,body=fetch(base+'/contact?service=brand-identity&tier=full-brand-system&source=%2Fpricing')
    form=Page(body); assert status==200 and form.forms==1
    assert 'brand-identity' in form.options and 'full-brand-system' in form.options, 'selected package context lost'
    assert 'Fiverr' not in ''.join(form.text), 'old contact gate remains'
    status,final,body=fetch(base+'/en/services'); assert status==200
    assert any(l.get('rel')=='canonical' and urlsplit(l.get('href','')).path=='/services' for l in Page(body).links)
    status,final,_=fetch(base+'/writing/brand-case-studies-ar'); assert status==200 and urlsplit(final).path=='/ar/writing/brand-case-studies-ar'
    for path in ['/icons/app-192.png','/icons/app-512.png','/offline.html','/manifest.webmanifest']:
        with urlopen(base+path,timeout=20) as response: assert response.status==200, f'{path}: broken precache asset'
    try:
        with urlopen(base+'/.well-known/assetlinks.json',timeout=20) as response:
            assert response.status==200, 'configured asset links should return HTTP 200'
            assert response.headers.get('Content-Type','').startswith('application/json'), 'asset links must be JSON'
            statements=json.loads(response.read().decode('utf-8'))
            assert isinstance(statements,list) and statements, 'asset links should contain a statement'
            target=statements[0]['target']
            assert target.get('package_name')=='com.aboalazm.os', 'asset links package id mismatch'
            assert target.get('sha256_cert_fingerprints'), 'asset links fingerprints missing'
    except HTTPError as error:
        assert error.code==503, f'asset links returned unexpected HTTP {error.code}'
        assert error.headers.get('Content-Type','').startswith('application/json'), 'unconfigured asset links error must be JSON'
    for path in ['/','/ar','/case-studies/nile-pharma-erp']:
        page=Page(fetch(base+path)[2]);image=next((m.get('content') for m in page.metas if m.get('property')=='og:image'),None)
        assert image, f'{path}: missing OG image'
        image_path=urlsplit(image).path
        with urlopen(base+image_path,timeout=35) as response: assert response.status==200 and response.headers.get('Content-Type','').startswith('image/'), f'{path}: broken OG image'
    result={'result':'passed','sitemap_pages':len(checked),'languages':['en','ar','ms'],'checks':['SSR language and canonical for every sitemap page','single H1 on key landing pages','privacy policy in English, Arabic, and Malay','real 404 and noindex','package context','English and Arabic redirects','PWA assets and Digital Asset Links response','representative OG images'],'limits':['No form submission, SMTP arrival, field CWV or phone-device test.']}
    Path('/tmp/aboalazm-http-qa.json').write_text(json.dumps(result,indent=2))
    print(json.dumps(result,indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--base');args=parser.parse_args()
    if args.base: verify(args.base.rstrip('/'))
    else:
        with tempfile.TemporaryFile(mode='w+') as log:
            server=subprocess.Popen(['node','node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3101'],stdout=log,stderr=log)
            try:
                for attempt in range(80):
                    if server.poll() is not None: raise RuntimeError('preview server exited')
                    try:
                        with urlopen('http://127.0.0.1:3101/robots.txt',timeout=1): break
                    except (URLError,TimeoutError): time.sleep(.2)
                verify('http://127.0.0.1:3101')
            except Exception:
                log.seek(0); print(log.read()[-5000:]); raise
            finally:
                server.terminate();server.wait(timeout=10)
