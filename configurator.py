from flask import Flask, request, jsonify, Blueprint
import globals
configurator = Blueprint('configurator', __name__, template_folder='templates')

@configurator.route('/set-report-name', methods=['POST'])
def set_report_name():
    globals.reportName=request.form['name']    
    return 'Report name set to %s' % globals.get_report_name()  