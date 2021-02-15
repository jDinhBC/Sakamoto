# import discord.py allows access to discords api
import discord

# import os module
import os

#import youtube module
import youtube_dl

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


class Music(commands.Cog)

    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def join(self, ctx, channel: discord.VoiceChannel):
        #Joins the voice channel

        if ctx.voice_client is not None:
            return await ctx.voice_client.move_to(channel)

        await channel.connect()

    @commands.command()
    async def play(self, ctx, url):
        #plays url

        await with ctx.typing():
            player = await YTDLSource.from_url(url, loop=self.bot.loop, stream=True)
            ctx.voice_client.play(player, after=lambda e:print('Player error: %s' % e) if e else None)

        await ctx.send('Now playing: {}'.format(player.title))

    @commands.command()
    async def disconnect(ctx):
        await ctx.voice_channel.disconnect()



    
@bot.event
async def on_ready():
    #prints when bot is ready 
    print('Bot Armed and Ready!')

#edit
#running bot
bot.run(DISCORD_TOKEN)
