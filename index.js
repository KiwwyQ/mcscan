const net = require('net');
const fs = require('fs');
const mc = require('minecraft-protocol');
const { Client } = require('discord.js-12');
const {MessageEmbed, Message} = require('discord.js-12');
const client = new Client({intents:32767});
const { keep_alive } = require("./keep");

const found = 'online_servers.txt';
let skip = 'checked_ips.txt';
let possible = 'offline_servers.txt';
let found_ip = '';
let old = '';

let run = 0;

let ip = '';
let port = 25565;
let threads = 15;


function countLines(filename) {
  const contents = fs.readFileSync(filename, 'utf8');
  return contents.split('\n').length;
}


client.on('ready', function() {
  console.log('up -_-');
});

 client.on('message', async message => {
if(message.author.id.startsWith(process.env['AU'])){
  if(run == 0){run = 1;}else{run = 0;}
   message.channel.send(`😈️ Scaning state is now ${run}`)
      if(run == 1){ executeWithRandomDelay(); }
    }
  });
client.login(process.env['LOGIN']);

const startIP = '0.0.0.0';
const endIP = '255.255.255.255';
function generateRandomIP(startIP, endIP) {
  const startOctets = startIP.split('.').map(Number);
  const endOctets = endIP.split('.').map(Number);
  const randomOctets = startOctets.map((startOctet, index) => {
    const endOctet = endOctets[index];
    return Math.floor(Math.random() * (endOctet - startOctet + 1)) + startOctet;
  });
  return randomOctets.join('.');
}

function check(){
if (fs.existsSync(skip)) {
  const fileContent = fs.readFileSync(skip, 'utf-8');
  if (fileContent.includes(ip)) { ip = generateRandomIP(startIP, endIP); check(); } else {}} else {}
}

function scan(){
ip = generateRandomIP(startIP, endIP);
check();
console.log(`[🔁] Trying to scan at ${ip}:${port} `);
let client = net.connect(port, ip, () => {
  console.log(`[🤔] Checking ${ip}:${port}...`);
fetch(process.env['CH'], {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Found something like mc server, checking...'
  })
})
  old = `${ip}:${port}`;
  fs.appendFile(possible, ip+"\n", (err) => { if (err) {console.error(err); return; } });
mc.ping({
    host: ip,
    port: port
}, function(err, res) {
    if (err) {
        console.log(`[🛑] A ${old} not what we need!`);
  fetch(process.env['CH'], {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: `No, seems like that server offline`
  })
})
    } else {
    console.log(`[🔥] Server ${ip}:${port} found and now listed! (Version: ${res.version.name} | Online: ${res.players.online}/${res.players.max})`);
fetch(process.env['CH'], {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: `Found online mc server on version ${res.version.name}`
  })
})
      
 found_ip = `${ip}:${port} [${res.version.name} ${res.players.online}/${res.players.max}] `+"\n";
 fs.appendFile(found, found_ip, (err) => {
  if (err) {
    console.error(err);
    return;
  }
});
    }
});
});
client.end();
 fs.appendFile(skip, ip+"\n", (err) => { if (err) {console.error(err); return; } });
client.on('error', (err) => {
});
}

function executeWithRandomDelay() {
  const randomDelay = Math.floor(Math.random() * 798) + 490;
  setTimeout(() => {
   for(i=0;i!==threads;i++){ scan(); }
   if(run == 1){ executeWithRandomDelay(); }
  }, randomDelay);
}
if(run == 1){ executeWithRandomDelay(); }
