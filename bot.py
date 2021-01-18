# import discord.py allows access to discords api
import discord

# impor os module
import os

#import load_dotenv func from dotenv module
from dotenv import load_dotenv

#import commands from discord.ext module
from discord.ext import commands

#load .env file that resides onthe same level as the script
load_dotenv()

#grab the api token from the .env file
DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")

#creating new bot object with a specified prefix
bot = commands.Bot(command_prefix = '!')
#startdate = datetime.datetime.now().strftime("%x")

# Letting Bot see everyone in discord
intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)

#edit
#running bot
bot.run(DISCORD_TOKEN)
