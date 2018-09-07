#!/usr/bin/python3
import requests
import json
from keys import client_id, api_key, headers, username
from geopy import geocoders
from geopy.geocoders import Nominatim
from flask import Flask, render_template, request, redirect

app = Flask(__name__)
app.url_map.strict_slashes = False

@app.route('/')
def mainpage():
    return render_template('index.html')

@app.route('/search', methods=['POST', 'GET'])
def find_food(category=None, location=None):
    # ChowSafely's user account
    if request.method == "POST":
        category = request.json['concern']
        location = request.json['city']
        if request.json['distance'] is not None:
            distance = request.json['distance']
        else:
            distance = ''
    check_category = ["vegan", "vegetarian", "gluten-free", "Vegan", "Vegetarian", "Gluten-free", "Gluten-Free", "gluten-Free"]
    if category not in check_category:
        return json.dumps({'reason': 'bad_category'})
    geopy_instance = geocoders.GeoNames(username=username)

    check_digit = location.isdigit()
    if check_digit is False:
        return json.dumps({})

    try:
        geolocator = Nominatim(user_agent="myproject")
        checkstr = location + " USA"
        thelocation = geolocator.geocode(checkstr)
        latitude = str(thelocation.raw['lat'])
        longitude = str(thelocation.raw['lon'])
    except:
        return json.dumps({})
    url = 'https://api.yelp.com/v3/businesses/search?categories=' + category + '&latitude=' + latitude + '&longitude=' + longitude
    response = requests.get(url, headers=headers)
    response = response.json()
    myList = []
    myDict = {}
    for biz in response['businesses']:
        eachitem = {}            
        # Validates that result is not too far out of user's desired radius
        eachitem['rating'] = biz.get('rating')
        thedist = biz.get('distance')
        eachitem['url'] = biz.get('url')
        if distance == '':
            pass
        elif (float(thedist) / 1609.34) > float(distance):
            break
        if biz.get('phone') == '':
            continue
        if biz.get('location').get('display_address') == '':
            continue
        if biz.get('location').get('address1') == '':
            continue
        for key, val in biz.items():
            if key == 'name':
                business_name = val
                eachitem['name'] = business_name
            elif key == 'phone':
                phone_num = val
                eachitem['phone'] = phone_num
            elif key == 'categories':
                for list_item in val:
                    alias = list_item['title']
            elif key == 'location':
                for place, address in val.items():
                    if place == 'display_address':
                        # some listings have suite numbers, so this checks before assigning the address
                        if len(address) == 3:
                            street_num = address[0]
                            suite_num = address[1]
                            city_info = address[2]
                            eachitem['street'] = street_num + ', ' + suite_num
                            eachitem['city_info'] = city_info
                        elif len(address) == 2:
                            street_num = address[0]
                            city_info = address[1]
                            eachitem['street'] = street_num
                            eachitem['city_info'] = city_info
                        else:
                            break
                eachitem['location'] = location.replace('_', ' ')
            elif key == 'id':
                business_id = val
        myList.append(eachitem)
    myDict['business'] = myList
    return json.dumps(myDict)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
