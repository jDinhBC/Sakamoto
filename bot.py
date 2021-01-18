import discord
from discord.ext import commands

import dbManager

import random
import datetime
import time

TOKEN = ''
client = commands.Bot(command_prefix = '!')
startdate = datetime.datetime.now().strftime("%x")
intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)
listofcommands = ["help", "remind", "forget", "edit", "roast", "rps", "listreminders", "daily", "money", "stats"]

listofroasts = []
memberDB = []
"""
def updateDB():
    file = open("memberDB.txt", "r")
    memberDB.clear()
    for line in file:
        memberDB.append(line)

    line = ""
    file.close()

def updatefile(update, name, amount, level, daily):
    datatext = ""
    if update == False:
        file = open("memberDB.txt", "a")
        datatext = "{}, {}, {}, {}\n".format(name, amount, level, daily)
        file.write(datatext)
        file.close()
    else:
        linenumber = countLines(name)
        file = open("memberDB.txt", "w")
        for x in range(linenumber):
            file.write(memberDB[x])
        x = searchfile(name)
        print("Printing x: {}".format(x))
        print("")
        print("datatext error")
        datatext = "{}, {}, {}, {}\n".format(name, int(x[1]) + int(amount), level, str(daily))
        file.write(datatext)
        for x in range(linenumber+1,len(memberDB)):
            file.write(memberDB[x])
        file.close()
    updateDB()

def searchfile(name):
    result = []
    test = str(name)
    file = open('memberDB.txt', 'r')
    for line in file:
        print("{} : {}".format(test, line))
        print(test in line)
        if test in line:
            result = line.split(", ")
            line = ""
            file.close()
            print("found")
            print(result)
            return result
    file.close()
    line = ""
    print("how")
    return False

def countLines(name):
    linenum = 0
    file = open('memberDB.txt', 'r')
    for line in file:
        linenum += 1
        if name in line:
            return linenum
    return None

def fillDB():
    print("what")
    for guild in client.guilds:
        for member in guild.members:
            if searchfile(str(member)) == False:
                updatefile(False, str(member), 1000, 1, False)

    file = open("roasts.txt", "r")
    for line in file:
        listofroasts.append(line)
    file.close()

def testdate():
    file = open("date.txt", "r")
    date = file.readline()
    file.close()
    testdate = datetime.datetime.now().strftime("%x")
    if testdate != date:
        dailyreset()
        writedate(testdate)

def writedate(date):
    file = open("date.txt", "w")
    text = "{}".format(datetime.datetime.now().strftime("%x"))
    file.write(text)
    file.close()

def dailyreset():
    for guild in client.guilds:
        for member in guild.members:
            if searchfile(str(member))[3] == True:
                updatefile(True, str(member), searchfile(str(member))[1], searchfile(str(member))[2], False)
"""
@client.event
async def on_ready():
    """
    Bot Ready Check
    """
    print('Bot is Ready.\n')

@client.event
async def on_message(message):
    author = str(message.author)
    activated = False

    if message.content.startswith('!'):
        if (message.content.lower() == '!help'):
            await message.channel.send(
            '''
            !help (command) - shows all commands / shows command usage
            !rps (r/p/s) (bet) - rock paper scissors (work in progress)
            !remind (reminder) (time) () - schedule a reminder (work in progress)
            !forget (reminder) ()
            ''')
            activated = True

        if (message.content.startswith('!roast')):
            await message.channel.send(listofroasts[random.randint(0,10)])
            activated = True

        if ("angry" in message.content):
            await message.channel.send("https://www.youtube.com/watch?v=XnQ-5uFuDtc")
            activated = True

        if (message.content.startswith('!daily')):
            await message.channel.send("You have claimed your daily 500 coins")
            await message.channel.send("You have already claimed your daily coins.")
            activated = True

        if (activated == False ):
            await message.channel.send("Invalid Command/Inputs")

if __NAME__ == __MAIN__:
    TOKEN = input("Input Token: ")
client.run(TOKEN)
