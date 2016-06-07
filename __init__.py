from flask import Flask, request, jsonify, send_from_directory
import json
import time
from datetime import datetime
from datacollector.data_collector import d_c
from panel.panel import panel
from configurator import configurator
from data_processor.data_processor import data_processor
from monitoring.monitoring import monitoring
from clusterer.clustering import clustering
from reporting.reporting import reporting
app = Flask(__name__)
app.register_blueprint(d_c)
app.register_blueprint(configurator)
app.register_blueprint(panel)
app.register_blueprint(data_processor)
app.register_blueprint(monitoring)
app.register_blueprint(clustering)
app.register_blueprint(reporting)
@app.route('/')
def hello_world():
    return 'Hello World!'
    
@app.route('/Web/<path:path>')
def send_js(path):
    return send_from_directory('Web', path)
    
@app.route('/Web/')
def send_index():
    return send_from_directory('Web', 'index.html')

@app.route('/counter')
def counter():
    global counter_val
    counter_val+=1
    return jsonify({'test':counter_val})
if __name__ == '__main__':
    app.run(debug=True)