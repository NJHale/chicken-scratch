# # coop_routes.py
# import os
# from flask import Flask
# from flask import jsonify
# from flask import request
# from flask_pymongo import PyMongo
#
# app = Flask(__name__)
#
# # Get mongodb configurations
# app.config['MONGO_DBNAME'] = os.getenv('MONGO_DBNAME', 'coopdb')
# app.config['MONGO_URI'] = ('mongodb://%s:%s/restdb',
#                            os.getenv('PYTHON_COOP_STORE_DB_SERVICE_HOST',
#                                      'localhost'),
#                            os.getenv('PYTHON_COOP_STORE_DB_SERVICE_PORT'))
#
# mongo = PyMongo(app)
#
# @app.route('/star', methods=['GET'])
# def get_all_stars():
#   star = mongo.db.stars
#   output = []
#   for s in star.find():
#     output.append({'name' : s['name'], 'distance' : s['distance']})
#   return jsonify({'result' : output})
#
# @app.route('/star/', methods=['GET'])
# def get_one_star(name):
#   star = mongo.db.stars
#   s = star.find_one({'name' : name})
#   if s:
#     output = {'name' : s['name'], 'distance' : s['distance']}
#   else:
#     output = "No such name"
#   return jsonify({'result' : output})
#
# @app.route('/star', methods=['POST'])
# def add_star():
#   star = mongo.db.stars
#   name = request.json['name']
#   distance = request.json['distance']
#   star_id = star.insert({'name': name, 'distance': distance})
#   new_star = star.find_one({'_id': star_id })
#   output = {'name' : new_star['name'], 'distance' : new_star['distance']}
#   return jsonify({'result' : output})
#
# if __name__ == '__main__':
#     app.run(host=os.getenv('PYTHON_COOP_STORE_SERVICE_HOST', '0.0.0.0'),
#             port=int(os.getenv('PYTHON_COOP_STORE_SERVICE_PORT_HTTP', 8080)))

from flask import Flask
application = Flask(__name__)

@application.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    application.run(debug = "True",port=8080)
