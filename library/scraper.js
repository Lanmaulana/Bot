const axios = require('axios')
const cheerio = require('cheerio')
const gis = require("g-i-s")
const { createCanvas, loadImage } = require("canvas")

async function getAccessToken() {
  try {
    const client_id = 'acc6302297e040aeb6e4ac1fbdfd62c3'
    const client_secret = '0e8439a1280a43aba9a5bc0a16f3f009'
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return response.data.access_token
  } catch (err) {
    console.error(err)
  }
}

async function spotifySearch(query) {
  try {
    const access_token = await getAccessToken()
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return response.data.tracks.items.map(track => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      link: track.external_urls.spotify,
      image: track.album.images[0].url,
      duration_ms: track.duration_ms
    }));
  } catch (err) {
    console.error(err)
  }
}

async function profileMenu(options) {
  const {
    backgroundURL,
    avatarURL,
    rankName,
    rankid,
    exp,
    requireExp,
    level,
    name,
  } = options;

  const width = 850;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  const background = await loadImage(backgroundURL);
  ctx.drawImage(background, 0, 0, width, height);

  const overlayX = 20;
  const overlayY = 20;
  const overlayWidth = width - 40;
  const overlayHeight = height - 40;
  const overlayRadius = 30;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 51, 0.7)';
  ctx.beginPath();
  ctx.moveTo(overlayX + overlayRadius, overlayY);
  ctx.arcTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + overlayHeight, overlayRadius);
  ctx.arcTo(overlayX + overlayWidth, overlayY + overlayHeight, overlayX, overlayY + overlayHeight, overlayRadius);
  ctx.arcTo(overlayX, overlayY + overlayHeight, overlayX, overlayY, overlayRadius);
  ctx.arcTo(overlayX, overlayY, overlayX + overlayWidth, overlayY, overlayRadius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const avatar = await loadImage(avatarURL);
  const avatarSize = 180;
  ctx.save();
  ctx.beginPath();
  ctx.arc(150, height / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 60, height / 2 - avatarSize / 2, avatarSize, avatarSize);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(150, height / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.strokeStyle = '#003366';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText(name, 280, height / 2 - 30);

  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`LEVEL ${level}`, 280, height / 2 + 10);

  ctx.font = 'bold 22px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${rankName}`, 280, height / 2 + 50);

  const barWidth = 500;
  const barHeight = 30;
  const barX = 280;
  const barY = height / 2 + 100;
  const progress = exp / requireExp;
  const barRadius = 15;

  ctx.fillStyle = '#555555';
  ctx.beginPath();
  ctx.moveTo(barX + barRadius, barY);
  ctx.arcTo(barX + barWidth, barY, barX + barWidth, barY + barHeight, barRadius);
  ctx.arcTo(barX + barWidth, barY + barHeight, barX, barY + barHeight, barRadius);
  ctx.arcTo(barX, barY + barHeight, barX, barY, barRadius);
  ctx.arcTo(barX, barY, barX + barWidth, barY, barRadius);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#003366';
  ctx.beginPath();
  ctx.moveTo(barX + barRadius, barY);
  ctx.arcTo(barX + barWidth * progress, barY, barX + barWidth * progress, barY + barHeight, barRadius);
  ctx.arcTo(barX + barWidth * progress, barY + barHeight, barX, barY + barHeight, barRadius);
  ctx.arcTo(barX, barY + barHeight, barX, barY, barRadius);
  ctx.arcTo(barX, barY, barX + barWidth * progress, barY, barRadius);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#003366';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(barX + barRadius, barY);
  ctx.arcTo(barX + barWidth, barY, barX + barWidth, barY + barHeight, barRadius);
  ctx.arcTo(barX + barWidth, barY + barHeight, barX, barY + barHeight, barRadius);
  ctx.arcTo(barX, barY + barHeight, barX, barY, barRadius);
  ctx.arcTo(barX, barY, barX + barWidth, barY, barRadius);
  ctx.closePath();
  ctx.stroke();

  ctx.font = 'bold 20px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(`${exp} / ${requireExp}`, barX + barWidth / 2, barY + barHeight - 5);

  return canvas.toBuffer();
}

async function profileMenu50(options) {
  const {
    backgroundURL,
    avatarURL,
    rankName,
    rankid,
    exp,
    requireExp,
    level,
    name,
  } = options;

  // **Ubah ukuran canvas ke 1220x686 (16:9)**
  const width = 1220;
  const height = 686;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  // **Tambahkan background image**
  const background = await loadImage(backgroundURL);
  ctx.drawImage(background, 0, 0, width, height);

  // **Buat overlay transparan**
  const overlayX = 30;
  const overlayY = 30;
  const overlayWidth = width - 60;
  const overlayHeight = height - 60;
  const overlayRadius = 40;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 51, 0.75)';
  ctx.beginPath();
  ctx.moveTo(overlayX + overlayRadius, overlayY);
  ctx.arcTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + overlayHeight, overlayRadius);
  ctx.arcTo(overlayX + overlayWidth, overlayY + overlayHeight, overlayX, overlayY + overlayHeight, overlayRadius);
  ctx.arcTo(overlayX, overlayY + overlayHeight, overlayX, overlayY, overlayRadius);
  ctx.arcTo(overlayX, overlayY, overlayX + overlayWidth, overlayY, overlayRadius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // **Tambahkan avatar lebih besar**
  const avatar = await loadImage(avatarURL);
  const avatarSize = 250;
  ctx.save();
  ctx.beginPath();
  ctx.arc(200, height / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 75, height / 2 - avatarSize / 2, avatarSize, avatarSize);
  ctx.restore();

  // **Beri border pada avatar**
  ctx.beginPath();
  ctx.arc(200, height / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.strokeStyle = '#007acc';
  ctx.lineWidth = 8;
  ctx.stroke();

  // **Tambahkan Nama & Level**
  ctx.font = 'bold 50px Montserrat';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText(name, 320, height / 2 - 40);

  ctx.font = 'bold 32px Montserrat';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`LEVEL ${level}`, 320, height / 2 + 10);

  ctx.font = 'bold 26px Montserrat';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${rankName}`, 320, height / 2 + 60);

  // **Progress Bar**
  const barWidth = 700;
  const barHeight = 40;
  const barX = 320;
  const barY = height / 2 + 120;
  const progress = exp / requireExp;
  const barRadius = 20;

  // **Background bar (gelap)**
  ctx.fillStyle = '#333333';
  ctx.beginPath();
  ctx.moveTo(barX + barRadius, barY);
  ctx.arcTo(barX + barWidth, barY, barX + barWidth, barY + barHeight, barRadius);
  ctx.arcTo(barX + barWidth, barY + barHeight, barX, barY + barHeight, barRadius);
  ctx.arcTo(barX, barY + barHeight, barX, barY, barRadius);
  ctx.arcTo(barX, barY, barX + barWidth, barY, barRadius);
  ctx.closePath();
  ctx.fill();

  // **Progress bar (biru cerah)**
  ctx.fillStyle = '#00aaff';
  ctx.beginPath();
  ctx.moveTo(barX + barRadius, barY);
  ctx.arcTo(barX + barWidth * progress, barY, barX + barWidth * progress, barY + barHeight, barRadius);
  ctx.arcTo(barX + barWidth * progress, barY + barHeight, barX, barY + barHeight, barRadius);
  ctx.arcTo(barX, barY + barHeight, barX, barY, barRadius);
  ctx.arcTo(barX, barY, barX + barWidth * progress, barY, barRadius);
  ctx.closePath();
  ctx.fill();

  // **Progress bar outline**
  ctx.strokeStyle = '#007acc';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(barX + barRadius, barY);
  ctx.arcTo(barX + barWidth, barY, barX + barWidth, barY + barHeight, barRadius);
  ctx.arcTo(barX + barWidth, barY + barHeight, barX, barY + barHeight, barRadius);
  ctx.arcTo(barX, barY + barHeight, barX, barY, barRadius);
  ctx.arcTo(barX, barY, barX + barWidth, barY, barRadius);
  ctx.closePath();
  ctx.stroke();

  // **Text di tengah progress bar**
  ctx.font = 'bold 24px Montserrat';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(`${exp} / ${requireExp}`, barX + barWidth / 2, barY + barHeight - 8);

  return canvas.toBuffer();
}

async function gempa() {
return new Promise(async(resolve,reject) => {
                axios.get('https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg')
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const drasa = [];
                        $('table > tbody > tr:nth-child(1) > td:nth-child(6) > span').get().map((rest) => {
         					dir = $(rest).text();
         					drasa.push(dir.replace('\t', ' '))
        				})
        				teks = ''
        				for(let i=0; i<drasa.length; i++){
        					teks += drasa[i] + '\n'
        				}
        				const rasa = teks
                        const format = {
                        	imagemap : $('div.modal-body > div > div:nth-child(1) > img').attr('src'),
                        	magnitude : $('table > tbody > tr:nth-child(1) > td:nth-child(4)').text(),
                        	kedalaman: $('table > tbody > tr:nth-child(1) > td:nth-child(5)').text(),
                        	wilayah: $('table > tbody > tr:nth-child(1) > td:nth-child(6) > a').text(),
                        	waktu: $('table > tbody > tr:nth-child(1) > td:nth-child(2)').text(),
                        	lintang_bujur: $('table > tbody > tr:nth-child(1) > td:nth-child(3)').text(),
                        	dirasakan: rasa
                        }
                        const result = {
                        	creator: 'Vreden Official',
                        	data: format
                        }
                  resolve(result)
			})
                .catch(reject)
            })
}

function kapital(text) {
  return text.split(/([.!?]\s*)/).map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()).join('')
}

async function levelUp(options) {
  const { backgroundURL, avatarURL, fromLevel, toLevel, name } = options;

  const width = 600;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  const background = await loadImage(backgroundURL);
  ctx.drawImage(background, 0, 0, width, height);

  const overlayX = 10;
  const overlayY = 10;
  const overlayWidth = width - 20;
  const overlayHeight = height - 20;
  const overlayRadius = 40;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 51, 0.6)';
  ctx.beginPath();
  ctx.moveTo(overlayX + overlayRadius, overlayY);
  ctx.arcTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + overlayHeight, overlayRadius);
  ctx.arcTo(overlayX + overlayWidth, overlayY + overlayHeight, overlayX, overlayY + overlayHeight, overlayRadius);
  ctx.arcTo(overlayX, overlayY + overlayHeight, overlayX, overlayY, overlayRadius);
  ctx.arcTo(overlayX, overlayY, overlayX + overlayWidth, overlayY, overlayRadius);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const avatar = await loadImage(avatarURL);
  const avatarSize = 100;
  const avatarX = overlayX + overlayRadius + 10;
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, height / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, avatarX, height / 2 - avatarSize / 2, avatarSize, avatarSize);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, height / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.strokeStyle = '#FE4D07';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText(name, avatarX + avatarSize + 20, height / 2 + 10);

  const circleSize = 55;
  const circleX1 = width - circleSize * 4 + 10;
  const circleX2 = width - circleSize * 2 - 8;
  const arrowX = circleX1 + circleSize + 10;

  ctx.beginPath();
  ctx.arc(circleX1 + circleSize / 2, height / 2, circleSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 77, 7, 1)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(circleX1 + circleSize / 2, height / 2, circleSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.strokeStyle = '#FE4D07';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(fromLevel, circleX1 + circleSize / 2, height / 2 + 8);

  ctx.beginPath();
  ctx.moveTo(arrowX, height / 2 - 8);
  ctx.lineTo(arrowX + 20, height / 2);
  ctx.lineTo(arrowX, height / 2 + 8);
  ctx.closePath();
  ctx.fillStyle = '#FE4D07';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(circleX2 + circleSize / 2, height / 2, circleSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(51, 153, 255, 0.3)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(circleX2 + circleSize / 2, height / 2, circleSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.strokeStyle = '#FE4D07';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(toLevel, circleX2 + circleSize / 2, height / 2 + 8);

  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.moveTo(overlayX + overlayRadius, overlayY);
  ctx.arcTo(overlayX + overlayWidth, overlayY, overlayX + overlayWidth, overlayY + overlayHeight, overlayRadius);
  ctx.arcTo(overlayX + overlayWidth, overlayY + overlayHeight, overlayX, overlayY + overlayHeight, overlayRadius);
  ctx.arcTo(overlayX, overlayY + overlayHeight, overlayX, overlayY, overlayRadius);
  ctx.arcTo(overlayX, overlayY, overlayX + overlayWidth, overlayY, overlayRadius);
  ctx.closePath();
  ctx.fill();

  return canvas.toBuffer();
}

async function spotifyDl(url) {
  try {
    const hai = await axios.get(`https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`)
    const hao = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${hai.data.result.gid}/${hai.data.result.id}`)
    return {
      title: hai.data.result.name,
      download: `https://api.fabdl.com${hao.data.result.download_url}`,
      image: hai.data.result.image,
      duration_ms: hai.data.result.duration_ms
    }
  } catch (err) {
    console.error(err)
  }
}

async function jadwalsholat(query) {
    return new Promise((resolve, reject) => {
        axios.get(`https://umrotix.com/jadwal-sholat/${query}`)
            .then(({
                data
            }) => {
                const $ = cheerio.load(data)
                $('body > div > div.main-wrapper.scrollspy-action > div:nth-child(3) ').each(function(a, b) {   
                    result = {
                    status: 200,
                    author: 'vreden official',
                    tanggal: $(b).find('> div:nth-child(2)').text(),
                    imsyak: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(1) > p:nth-child(2)').text(),
                    subuh: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(2) > p:nth-child(2)').text(),
                    dzuhur: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(3) > p:nth-child(2)').text(),
                    ashar: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(4) > p:nth-child(2)').text(),
                    maghrib: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(5) > p:nth-child(2)').text(),
                    isya: $(b).find('> div.panel.daily > div > div > div > div > div:nth-child(6) > p:nth-child(2)').text()
                }
                resolve(result)
                })
            })
            .catch(reject)
    })
}
async function pinterest(query) {
	return new Promise((resolve, reject) => {
	  let err = { status: 404, message: "Terjadi kesalahan" }
	  gis({ searchTerm: query + ' site:id.pinterest.com', }, (er, res) => {
	   if (er) return err
	   let hasil = []
	   res.forEach(x => hasil.push(x.url))
	   resolve(hasil)
	  })
	})
}

async function pinterest2(query) {
  try {
    const response = await axios.get(`https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${query}&data={"options":{"query":"${query}","scope":"pins","page_size":25}}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    })

    let images = []
    const data = response.data
    data.resource_response.data.results.forEach((item) => {
      if (item.images.orig.url) {
        images.push(item.images.orig.url)
      }
    })

    const randomImage = images[Math.floor(Math.random() * images.length)]

    return randomImage
  } catch (err) {
    console.error('Error:', err)
    return null
  }
}

const search = async (src) => {
try {
let o = await axios.get(`https://deliriussapi-oficial.vercel.app/search/ytsearch?q=${encodeURIComponent(src)}`)
let u = o.data.data || []
return u
} catch (err) {
console.error(err)
return []
}}

async function wallpaper(title, page = '1') {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.besthdwallpaper.com/search?CurrentPage=${page}&q=${title}`)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('div.grid-item').each(function (a, b) {
                hasil.push({
                    title: $(b).find('div.info > a > h3').text(),
                    type: $(b).find('div.info > a:nth-child(2)').text(),
                    source: 'https://www.besthdwallpaper.com/'+$(b).find('div > a:nth-child(3)').attr('href'),
                    image: [$(b).find('picture > img').attr('data-src') || $(b).find('picture > img').attr('src'), $(b).find('picture > source:nth-child(1)').attr('srcset'), $(b).find('picture > source:nth-child(2)').attr('srcset')]
                })
            })
            resolve(hasil)
        })
    })
}

async function wikimedia(title) {
    return new Promise((resolve, reject) => {
        axios.get(`https://commons.wikimedia.org/w/index.php?search=${title}&title=Special:MediaSearch&go=Go&type=image`)
        .then((res) => {
            let $ = cheerio.load(res.data)
            let hasil = []
            $('.sdms-search-results__list-wrapper > div > a').each(function (a, b) {
                hasil.push({
                    title: $(b).find('img').attr('alt'),
                    source: $(b).attr('href'),
                    image: $(b).find('img').attr('data-src') || $(b).find('img').attr('src')
                })
            })
            resolve(hasil)
        })
    })
}

async function quotesAnime() {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 184)
        axios.get('https://otakotaku.com/quote/feed/'+page)
        .then(({ data }) => {
            const $ = cheerio.load(data)
            const hasil = []
            $('div.kotodama-list').each(function(l, h) {
                hasil.push({
                    link: $(h).find('a').attr('href'),
                    gambar: $(h).find('img').attr('data-src'),
                    karakter: $(h).find('div.char-name').text().trim(),
                    anime: $(h).find('div.anime-title').text().trim(),
                    episode: $(h).find('div.meta').text(),
                    up_at: $(h).find('small.meta').text(),
                    quotes: $(h).find('div.quote').text().trim()
                })
            })
            resolve(hasil)
        }).catch(reject)
    })
}

async function trendtwit(country) {
	return new Promise((resolve,reject) => {
		axios.get(`https://getdaytrends.com/${country}/`)
		.then(({ data }) => {
			const $ = cheerio.load(data)
			const hastag = [];
      const tweet = [];
      const result = [];
      $('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr> td.main > a').each(function(a, b){
        deta = $(b).text()
        hastag.push(deta)
      })
      $('#trends > table.table.table-hover.text-left.clickable.ranking.trends.wider.mb-0 > tbody > tr > td.main > div > span').each(function(a, b){
        deta = $(b).text()
        tweet.push(deta)
      })
      num = 1
      for(let i=0; i<hastag.length; i++){
        result.push({
          rank: num,
          hastag: hastag[i],
          tweet: tweet[i]
        })
        num += 1
      }
		    resolve({
          country: country,
          result: result
        })
		})
		.catch(reject)
	})
}
async function webtoons(query) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.webtoons.com/id/search?keyword=${query}`)
    .then((data) => {
      const $ = cheerio.load(data.data)
      const judul = [];
      const genre = [];
      const author = [];
      const link = [];
      const likes = [];
      const format = [];
      $('#content > div > ul > li > a > div > p.subj').each(function(a, b) {
        deta = $(b).text();
        judul.push(deta)
      })
      $('div > ul > li > a > span').each(function(a, b) {
        deta = $(b).text();
        genre.push(deta)
      })
      $('div > ul > li > a > div > p.author').each(function(a, b) {
        deta = $(b).text();
        author.push(deta)
      })
      $('div > ul > li > a > div > p.grade_area > em').each(function(a, b) {
        deta = $(b).text();
        likes.push(deta)
      })
      $('#content > div > ul > li > a').each(function(a, b) {
        link.push($(b).attr('href'))
      })
      for(let i=0; i<judul.length; i++){
        format.push({
          judul: judul[i],
          genre: genre[i],
          author: author[i],
          likes: likes[i],
          link: link[i]
        })
      }
      if(likes == ''){
        resolve({
          status: `${query} tidak dapat ditemukan/error`
        })
      }
      else{
      resolve(format)
      }
    })
    .catch(reject)
  })
}
async function cariresep(query) {
	        return new Promise(async(resolve,reject) => {
                axios.get('https://resepkoki.id/?s=' + query)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const link = [];
                        const judul = [];
                        const upload_date = [];
                        const format = [];
                        const thumb = [];
                        $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-media > a').each(function(a,b){
                        	link.push($(b).attr('href'))
                        })
                        $('body > div.all-wrapper.with-animations > div:nth-child(5) > div > div.archive-posts.masonry-grid-w.per-row-2 > div.masonry-grid > div > article > div > div.archive-item-content > header > h3 > a').each(function(c,d){
                        	jud = $(d).text();
                        	judul.push(jud)
                        })
                        for( let i = 0; i < link.length; i++){
							format.push({
								judul : judul[i],
								link : link[i]
							})
						}
						const result = {
							creator: 'Fajar Ihsana',
							data : format
						}
                  resolve(result)
			})
                .catch(reject)
            })
}
async function android1(query) {
        return new Promise((resolve,reject) => {
                axios.get('https://an1.com/tags/MOD/?story=' + query + '&do=search&subaction=search')
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const nama = [];
                        const link = [];
                        const rating = [];
                        const thumb = [];
                        const developer = [];
                        const format = [];
                        $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.name > a > span').each(function(a,b) {
                          nem = $(b).text();
                          nama.push(nem)
                        })
                        $('div > ul > li.current-rating').each(function(c,d) {
                          rat = $(d).text();
                          rating.push(rat)
                        })
                        $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.developer.xsmf.muted').each(function(e,f) {
                          dev = $(f).text();
                          developer.push(dev)
                        })
                        $('body > div.page > div > div > div.app_list > div > div > div.img > img').each(function(g,h) {
                          thumb.push($(h).attr('src'))
                        })
                        $('body > div.page > div > div > div.app_list > div > div > div.cont > div.data > div.name > a').each(function(i,j) {
                          link.push($(j).attr('href'))
                        })
                        for(let i=0; i<link.length; i++){
                          format.push({
                            judul : nama[i],
                            dev : developer[i],
                            rating : rating[i], 
                            thumb : thumb[i],
                            link : link[i]
                          })
                        }
                       const result = {
                        creator : 'Vreden Official',
                        data : format
                       }
                  resolve(result)
                })
                .catch(reject)
        })
}
async function happymod(query) {
        return new Promise((resolve,reject) => {
                axios.get('https://www.happymod.com/search.html?q=' + query)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const nama = [];
                        const link = [];
                        const rating = [];
                        const thumb = [];
                        const format = [];
                        $('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > h3 > a').each(function(a,b) {
                          nem = $(b).text();
                          nama.push(nem)
                          link.push('https://happymod.com' + $(b).attr('href'))
                        })
                        $('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > div > div.clearfix > span').each(function(c,d) {
                          rat = $(d).text();
                          rating.push(rat)
                        })
                        $('body > div.container-row.clearfix.container-wrap > div.container-left > section > div > a > img').each(function(e,f) {
                          thumb.push($(f).attr('data-original'))
                        })
                        for(let i=0; i<link.length; i++){
                          format.push({
                            judul : nama[i],
                            thumb : thumb[i],
                            rating : rating[i],
                            link : link[i]
                          })
                        }
                       const result = {
                        creator : 'Vreden Ofc',
                        data : format
                       }
                  resolve(result)
                })
                .catch(reject)
        })
}
async function corona(country) {
  if (!country) return loghandler.noinput;
  try {
   const res = await axios.request(`https://www.worldometers.info/coronavirus/country/` + country, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
    }
  });
  let result = {};
  const $ = cheerio.load(res.data);
  result.status = res.status
  result.negara = $("div").find("h1").text().slice(3).split(/ /g)[0];
  result.total_kasus = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(0).text() + " total";
  result.total_kematian = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(1).text() + " total";
  result.total_sembuh = $("div#maincounter-wrap").find("div.maincounter-number > span").eq(2).text() + " total";
  result.informasi = $("div.content-inner > div").eq(1).text();
  result.informasi_lengkap = "https://www.worldometers.info/coronavirus/country/" + country;
  if(result.negara == ''){
  result.status = 'error'
}
  return result;
  } catch (error404) {
    return "=> Error => " + error404;
  }
};

async function mangatoon(search) {
  if (!search) return "No Querry Input! Bakaa >\/\/<";
  try {
  const res = await axios.get(`https://mangatoon.mobi/en/search?word=${search}`, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
    }
  });
  const hasil = [];
  const $ = cheerio.load(res.data);
  $('div.recommend-item').each(function(a, b) {
    let comic_name = $(b).find('div.recommend-comics-title > span').text();
    let comic_type = $(b).find('div.comics-type > span').text().slice(1).split(/ /g).join("");
    let comic_url = $(b).find('a').attr('href');
    let comic_thumb = $(b).find('img').attr('src');
    const result = {
      status: res.status,
      creator: "@dehan_j1ng",
      comic_name,
      comic_type,
      comic_url: 'https://mangatoon.mobi' + comic_url,
      comic_thumb
    };
    hasil.push(result);
  });
  let filt = hasil.filter(v => v.comic_name !== undefined && v.comic_type !== undefined);
  return filt;
  } catch (eror404) {
    return "=> Error =>" + eror404;
  }
}
async function hentai(query) {
    return new Promise((resolve, reject) => {
        const page = Math.floor(Math.random() * 1153)
        axios.get('https://sfmcompile.club/page/'+page)
        .then((data) => {
            const $ = cheerio.load(data.data)
            const hasil = []
            $('#primary > div > div > ul > li > article').each(function (a, b) {
                hasil.push({
                    title: $(b).find('header > h2').text(),
                    link: $(b).find('header > h2 > a').attr('href'),
                    category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
                    share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
                    views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
                    type: $(b).find('source').attr('type') || 'image/jpeg',
                    video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
                    video_2: $(b).find('video > a').attr('href') || ''
                })
            })
            resolve(hasil)
        })
    })
}
async function mediafire(query) {
	return new Promise((resolve,reject) => {
		axios.get(query)
		.then(({ data }) => {
			const $ = cheerio.load(data)
			const judul = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').text();
		  	const size = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(1) > span').text();
		  	const upload_date = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text();
		  	const link = $('#downloadButton').attr('href')
		  	const hsil = {
		  		judul : link.split('/')[5],
		  		upload_date : upload_date,
		  		size : size,
                                mime : link.split('/')[5].split('.')[1],
		  		link : link
		  	}
		  resolve(hsil)
		})
		.catch(reject)
	})
}
async function artinama(query) {
        return new Promise((resolve,reject) => {
        	queryy = query.replace(/ /g, '+')
                axios.get('https://www.primbon.com/arti_nama.php?nama1=' + query +'&proses=+Submit%21+')
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const result = $('#body').text();
						const result2 = result.split('\n      \n        \n        \n')[0]
						const result4 = result2.split('ARTI NAMA')[1]
						const result5 = result4.split('.\n\n')
						const result6 = result5[0] + '\n\n' + result5[1]
                  resolve(result6)
                })
                .catch(reject)
        })
}
async function wattpad(query) {
        return new Promise((resolve,reject) => {
                axios.get('https://www.wattpad.com/search/' + query)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const result = [];
                        const linkk= [];
                        const judull = [];
                        const thumb = [];
                        const dibaca = [];
                        const vote = [];
                        const bab =[];
                        $('ul.list-group > li.list-group-item').each(function(a,b) {
                            linkk.push('https://www.wattpad.com' + $(b).find('a').attr('href'))
                            thumb.push($(b).find('img').attr('src'))
                        })
                        $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(1) > div.icon-container > div > span.stats-value').each(function(e,f) {
                            baca = $(f).text();
                            dibaca.push(baca)
                        })
                        $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(2) > div.icon-container > div > span.stats-value').each(function(g,h) {
                            vot = $(h).text();
                            vote.push(vot)
                        })
                        $('div.story-card-data.hidden-xxs > div.story-info > ul > li:nth-child(3) > div.icon-container > div > span.stats-value').each(function(i,j) {
                            bb = $(j).text();
                            bab.push(bb)
                        })
                        $('div.story-card-data.hidden-xxs > div.story-info > div.title').each(function(c,d) {
                            titel = $(d).text();
                            judull.push(titel)
                        })
for(let i=0; i<linkk.length; i++){
if(!judull[i] == ''){
result.push({
judul : judull[i],
dibaca: dibaca[i],
divote: vote[i],
thumb : thumb[i],
link : linkk[i]
})
}
}
                  resolve(result)
                })
                .catch(reject)
        })
}
async function kiryu(query) {
        return new Promise((resolve,reject) => {
                axios.get('https://kiryuu.id/?s=' + query)
                .then(({ data }) => {
                        const $ = cheerio.load(data)
                        const result = [];
			const linkk= [];
			const judull = [];
			const thumb = [];
			const rating = [];
                        $('div.bsx > a').each(function(a,b) {
                                linkk.push($(b).attr('href'))
				judull.push($(b).attr('title'))
				thumb.push($(b).find('img').attr('src').split('?resize')[0])
			})
			$('div.rating > div.numscore').each(function(c,d) {
			rate = $(d).text();
			rating.push(rate)
			})
for(let i=0; i<linkk.length; i++){
result.push({
judul : judull[i],
rating : rating[i],
thumb : thumb[i],
link : linkk[i]
})
}
                  resolve(result)
                })
                .catch(reject)
        })
}

module.exports = { gempa, profileMenu, spotifySearch, profileMenu50, spotifyDl, kapital, levelUp, search, jadwalsholat, pinterest, pinterest2, wallpaper, wikimedia, quotesAnime, happymod, android1, cariresep, webtoons, trendtwit, mangatoon, mediafire, hentai, artinama, wattpad, kiryu, corona }
