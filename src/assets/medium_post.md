
# Embedding Tracker in a Email

Sometimes we send an email and think about whether that person opened my email or just ignored it.

In this article I will be explaing how you can embed trackers in your email, whether you are sending emails to your students, friends or anyone you can use this trick.

Let’s understand the approach first; basically, we want to ping our server whenever the user opens my email. To do this, we will be embedding one image at the last of the email; it can be any image I used my logo as it’s small, easy to load won’t look suspicious. Every time users open my email, it will make a GET request to my server. And my server will make a log of the request before serving the image.

Things needed-
1. Python Script Hosting (using Azure Serverless Function)
2. Database to Save logs (using Mongodb free Shared Clusters)
3. Your logo ;)

Students can $100 credit + 12 month free services on Azure, check more information at [https://azure.microsoft.com/en-in/free/students/](https://azure.microsoft.com/en-in/free/students/) .

If you are new to Azure Serverless function, have a look at [https://docs.microsoft.com/en-us/azure/developer/python/tutorial-vs-code-serverless-python-01](https://docs.microsoft.com/en-us/azure/developer/python/tutorial-vs-code-serverless-python-01) first. It`s Platform as a Service, just write code and deploy; Azure will manage the rest 😁.

**Let’s dive into the code —**

```python
#dependencies
import logging
import requests
import io
from datetime import datetime 
import pytz, os
import azure.functions as func
from pymongo import MongoClient

#mongodb connections
uri = os.getenv('MONGODB')
mongodb = MongoClient(uri)
db = mongodb['Email-tracker']

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    #fetching complete request header
    name = req.params.get('for') #unique identifier
    IST = pytz.timezone('Asia/Kolkata') #Indian timezone
    datetime_ist = datetime.now(IST) 
    time = f"{datetime_ist.strftime('%Y:%m:%d %H:%M:%S %Z %z')}"
    #create log in mongodb
    db.tracker.insert_one({'name': name, 'time' : time}) 
    #reading logo
    with io.open(f"abis_logo.png", "rb") as image_file:
        res = image_file.read()
    #returning image as a response
    return func.HttpResponse(
        res,
        mimetype='image/png;base64',
        status_code=200,
        headers = {
            'cache-control' : 'max-age=0,no-cache, no-store, must-revalidate'
        }
    )

```

**Whats happening in the code ?**
Whenever a request is processed, it will fetch the ‘for’ parameter from the URL, ‘for’ is a unique parameter used to distinguish between different emails. Then we get the current time according to the Indian timezone and create a log in the database with name and time. After this, we can send our logo as a response.

After deploying you will get URL something like ‘https://iamabhishek.azurewebsites.net/api/imageServe’

![](https://cdn-images-1.medium.com/max/2000/1*l2i48wd4fk3tcsoE7k6oRQ.png)

**How to use this-** Open Gmail or any other email GUI, right-click on the body section, and click ‘inspect as an element’ to insert HTML content in your email and put the image tag at the last of that div.

    <img src="[application_url]?for=[unique_text]" height=30px>

**Check the logs-** You can use MongoDB atlas to check the database or create a python script to check logs via Azure Functions.

![Sample Entry in Database](https://cdn-images-1.medium.com/max/2354/1*exFmT6Ayss0_Rye-EDni-g.png)*Sample Entry in Database*

**Note-** This function can be triggered by you as well, so make sure to ignore entries caused by you. The best way is to check the logs once before sending them.

**P.S.** If you ever receive mail from me containing my logo, it`s a tracker probably.😜.
