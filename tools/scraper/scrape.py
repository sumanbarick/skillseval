# import libraries
import urllib2
from bs4 import BeautifulSoup
import json
import re


# specify the url
global pageUrl
root = "https://www.indiabix.com"
#pageUrl = "https://www.indiabix.com/c-programming/declarations-and-initializations/"
topicUrl = "https://www.indiabix.com/c-sharp-programming/questions-and-answers/"
# declare list of all QA Dictionaries
qaList = []

###################################################################
# query the website and return the html to the variable 'page'
# parse the html using beautiful soap and store in variable `soup`
###################################################################
def extractSoup (url):
    return BeautifulSoup(urllib2.urlopen(url), "html.parser")

#################################################################


##################################################################
# Loop Thru Subtopics
##################################################################
def extractSubtopicQAs (topicUrl):
    soup = extractSoup(topicUrl)

    for topicIndex in soup.select(".div-topics-index"):
        for anchor in topicIndex.select("li a"):
            if anchor.attrs["href"].startswith("javascript:alert"):
                continue
            url = root + anchor.attrs["href"]
            fileName = anchor.text
            fileName = re.sub(r'[ /,]+', '-', fileName)
            print "Calling extract QA for " + url
            global qaList
            qaList = []
            extractQA(url)
            writeToJSONFile(fileName, qaList)


###################################################################
# Extract QA from all pages of a particular topic
###################################################################


def extractQA (pageUrl):
    soup = extractSoup(pageUrl)

    # select out all the QA Tables in this page
    qaTables = soup.select(".bix-tbl-container")

    # loop thru all the tables
    # And extract Question, Options and Ans
    for qa in qaTables:
        newQA = {}
        newQA["q"] = qa.select(".bix-td-qtxt")[0].text
        newQA["options"] = []

        for ans in qa.select(".bix-tbl-options tr"):
            newQA["options"].append(ans.select(".bix-td-option")[1].text)

        newQA["ans"] = qa.select(".bix-div-answer p span")[1].text

        global qaList
        qaList.append(newQA)


    # See if a next page exists
    pagination = soup.select(".mx-pager a")

    if len(pagination) > 0:
        nextPage =  pagination[len(pagination)-1]

        # See if (N | n) ext is present in the last pagination
        # Then Next Page is present
        # put the next page url in Global pageUrl var
        # And call itself again
        if "ext" in nextPage.text:
            pageUrl = root + nextPage.attrs["href"]
            extractQA(pageUrl)


###################################################################

def writeToJSONFile (fileName, dictContent):
    fileName = fileName[1:] if fileName.startswith('.') else fileName
    file = "target/out/" + fileName + '.json'
    print "Writing file " + file
    with open(file, 'w') as file:
        file.write(json.dumps(dictContent, indent=4))


##################################################################


##################################################################
def init ():
    extractSubtopicQAs(topicUrl)
    print "Done..."
##################################################################

init()