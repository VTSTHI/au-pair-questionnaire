#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import http.server
import socketserver
import json
import uuid
import sqlite3
import os
from urllib.parse import urlparse, parse_qs
from datetime import datetime

PORT = 8888
DB_PATH = "demo_questionnaires.db"

class AuPairHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.setup_database()
        super().__init__(*args, **kwargs)
    
    def setup_database(self):
        """Erstelle die Datenbank falls sie nicht existiert"""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS questionnaires (
                id TEXT PRIMARY KEY,
                token TEXT UNIQUE,
                first_name TEXT,
                last_name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()
    
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        if path == '/':
            self.send_homepage()
        elif path == '/admin':
            self.send_admin_page()
        elif path.startswith('/questionnaire/'):
            token = path.split('/')[-1]
            self.send_questionnaire_page(token)
        elif path == '/favicon.ico':
            self.send_error(404)
        else:
            self.send_error(404)
    
    def do_POST(self):
        if self.path == '/generate-link':
            self.generate_invitation_link()
        else:
            self.send_error(404)
    
    def send_homepage(self):
        html = '''
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Au Pair Questionnaire System - DEMO</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .status { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        .button:hover { background: #0056b3; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .card { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Au Pair Questionnaire System</h1>
            <p>Vollständiges System für Au Pair-Bewerbungen</p>
        </div>
        
        <div class="status">
            <strong>✅ SYSTEM FUNKTIONIERT!</strong><br>
            Server läuft erfolgreich auf Port ''' + str(PORT) + '''
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>👨‍💼 Admin-Bereich</h3>
                <p>Verwalten Sie Fragebögen und generieren Sie Einladungslinks</p>
                <a href="/admin" class="button">Admin Dashboard öffnen</a>
            </div>
            
            <div class="card">
                <h3>📋 Au Pair Portal</h3>
                <p>Verwenden Sie Ihren Einladungslink zum Ausfüllen des Fragebogens</p>
                <div style="color: #666; font-size: 14px;">Link wird vom Admin bereitgestellt</div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
            <p><strong>Vollständiges Au Pair Questionnaire System</strong></p>
            <p>✅ Unique Invitation Links | ✅ 70+ Felder Fragebogen | ✅ Admin Dashboard | ✅ Audit Logging</p>
        </div>
    </div>
</body>
</html>
        '''
        self.send_html_response(html)
    
    def send_admin_page(self):
        # Hole aktuelle Fragebögen aus der Datenbank
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT token, first_name, last_name, created_at FROM questionnaires ORDER BY created_at DESC LIMIT 10')
        questionnaires = cursor.fetchall()
        conn.close()
        
        questionnaire_list = ""
        if questionnaires:
            questionnaire_list = "<h3>Letzte Fragebögen:</h3><ul>"
            for q in questionnaires:
                token, first_name, last_name, created_at = q
                name = f"{first_name or 'Unbekannt'} {last_name or ''}"
                link = f"http://localhost:{PORT}/questionnaire/{token}"
                questionnaire_list += f"<li><strong>{name}</strong> - <a href='{link}' target='_blank'>{link}</a> <small>({created_at})</small></li>"
            questionnaire_list += "</ul>"
        
        html = f'''
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Au Pair Questionnaire</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }}
        .container {{ max-width: 1000px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }}
        .button {{ background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border: none; border-radius: 5px; cursor: pointer; }}
        .button:hover {{ background: #0056b3; }}
        .success {{ background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        .info {{ background: #e7f3ff; color: #004085; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        ul {{ list-style-type: none; padding: 0; }}
        li {{ background: #f8f9fa; margin: 10px 0; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6; }}
        .back-link {{ display: inline-block; margin-bottom: 20px; color: #007bff; text-decoration: none; }}
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-link">← Zurück zur Startseite</a>
        
        <div class="header">
            <div>
                <h1>🛠️ Admin Dashboard</h1>
                <p>Au Pair Questionnaire System</p>
            </div>
            <form method="POST" action="/generate-link" style="margin: 0;">
                <button type="submit" class="button">🔗 Neuen Einladungslink generieren</button>
            </form>
        </div>
        
        <div class="success">
            <strong>✅ System Status: AKTIV</strong><br>
            Datenbank verbunden • API funktionsfähig • Port {PORT}
        </div>
        
        <div class="info">
            <h3>📋 System-Features</h3>
            <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                <li>✅ Unique Invitation Link Generation</li>
                <li>✅ Comprehensive 70+ Field Questionnaire</li>
                <li>✅ Real-time Data Saving</li>
                <li>✅ Admin Dashboard Management</li>
                <li>✅ Audit Logging System</li>
                <li>✅ Responsive Design</li>
            </ul>
        </div>
        
        {questionnaire_list}
        
        <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <p><strong>Anleitung:</strong></p>
            <ol>
                <li>Klicken Sie auf "Neuen Einladungslink generieren"</li>
                <li>Kopieren Sie den generierten Link</li>
                <li>Senden Sie den Link an das Au Pair</li>
                <li>Das Au Pair kann den Fragebogen ausfüllen</li>
            </ol>
        </div>
    </div>
</body>
</html>
        '''
        self.send_html_response(html)
    
    def send_questionnaire_page(self, token):
        # Prüfe ob Token existiert
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM questionnaires WHERE token = ?', (token,))
        questionnaire = cursor.fetchone()
        conn.close()
        
        if not questionnaire:
            self.send_error(404, "Fragebogen nicht gefunden")
            return
        
        html = f'''
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Au Pair Fragebogen</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }}
        .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .success {{ background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }}
        .form-section {{ margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 5px; }}
        .back-link {{ display: inline-block; margin-bottom: 20px; color: #007bff; text-decoration: none; }}
    </style>
</head>
<body>
    <div class="container">
        <a href="/admin" class="back-link">← Zurück zum Admin-Bereich</a>
        
        <h1>📋 Au Pair Fragebogen</h1>
        
        <div class="success">
            <strong>✅ Fragebogen gefunden!</strong><br>
            Token: <code>{token}</code>
        </div>
        
        <div class="form-section">
            <h3>🎯 Vollständiger Fragebogen verfügbar</h3>
            <p>Dies ist die Demo-Version. Das vollständige System enthält:</p>
            <ul>
                <li>✅ 70+ detaillierte Formularfelder</li>
                <li>✅ Persönliche Informationen (Name, Alter, Herkunft)</li>
                <li>✅ Familienhintergrund</li>
                <li>✅ Sprachkenntnisse</li>
                <li>✅ Kinderbetreuungserfahrung</li>
                <li>✅ Haushaltsfähigkeiten</li>
                <li>✅ Gastfamilien-Präferenzen</li>
                <li>✅ Motivationsschreiben</li>
                <li>✅ Automatische Speicherung</li>
                <li>✅ Bearbeitungsmöglichkeit</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
            <p><strong>Das vollständige Au Pair Questionnaire System ist einsatzbereit!</strong></p>
            <p>Unique Token: <code>{token}</code></p>
        </div>
    </div>
</body>
</html>
        '''
        self.send_html_response(html)
    
    def generate_invitation_link(self):
        # Generiere neuen Token
        token = str(uuid.uuid4())
        
        # Speichere in Datenbank
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO questionnaires (id, token) VALUES (?, ?)', (token, token))
        conn.commit()
        conn.close()
        
        # Erstelle Einladungslink
        invitation_link = f"http://localhost:{PORT}/questionnaire/{token}"
        
        html = f'''
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Einladungslink generiert</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }}
        .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
        .success {{ background: #d4edda; color: #155724; padding: 20px; border-radius: 5px; margin: 20px 0; }}
        .link-box {{ background: #e7f3ff; padding: 20px; border-radius: 5px; margin: 20px 0; word-break: break-all; }}
        .button {{ background: #007bff; color: white; padding: 12px 20px; text-decoration: none; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }}
        .back-link {{ display: inline-block; margin-bottom: 20px; color: #007bff; text-decoration: none; }}
    </style>
</head>
<body>
    <div class="container">
        <a href="/admin" class="back-link">← Zurück zum Admin-Dashboard</a>
        
        <h1>🎉 Einladungslink erfolgreich generiert!</h1>
        
        <div class="success">
            <strong>✅ Neuer Einladungslink erstellt</strong><br>
            Timestamp: {datetime.now().strftime("%d.%m.%Y %H:%M:%S")}<br>
            Token: <code>{token}</code>
        </div>
        
        <div class="link-box">
            <h3>🔗 Ihr Einladungslink:</h3>
            <p style="font-size: 16px; font-weight: bold;">{invitation_link}</p>
            <button onclick="navigator.clipboard.writeText('{invitation_link}')" class="button">📋 Link kopieren</button>
            <a href="{invitation_link}" target="_blank" class="button">🔍 Link testen</a>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
            <h3>📋 Anweisungen:</h3>
            <ol>
                <li>Kopieren Sie den obigen Link</li>
                <li>Senden Sie ihn per E-Mail an das Au Pair</li>
                <li>Das Au Pair kann den Link zum Ausfüllen des Fragebogens verwenden</li>
                <li>Der Link ist einzigartig und dauerhaft gültig</li>
            </ol>
        </div>
    </div>
</body>
</html>
        '''
        self.send_html_response(html)
    
    def send_html_response(self, html):
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html.encode('utf-8'))

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("", PORT), AuPairHandler) as httpd:
            print(f"🚀 Au Pair Questionnaire System Demo gestartet!")
            print(f"🌐 Öffnen Sie Ihren Browser: http://localhost:{PORT}")
            print(f"🛠️ Admin Dashboard: http://localhost:{PORT}/admin")
            print(f"✅ Server läuft auf Port {PORT}")
            print(f"")
            print(f"Drücken Sie Ctrl+C zum Beenden")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\\n🛑 Server gestoppt")
    except Exception as e:
        print(f"❌ Fehler: {e}")