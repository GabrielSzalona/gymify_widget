async function getPeopleInGym() {
    const url = 'https://apius.reqbin.com/api/v1/requests'
    const payload = { "id": "0", "name": "", "errors": "", "json": "{\"method\":\"POST\",\"url\":\"https://gymify.app/api/v1/app/client/stats\",\"apiNode\":\"US\",\"contentType\":\"JSON\",\"content\":\"{\\\"date_from\\\":\\\"2024-02-01\\\",\\\"date_to\\\":\\\"2024-02-29\\\"}\",\"headers\":\"'Content-Type': 'application/json',\\n'Accept': 'application/json, text/plain, */*'\",\"errors\":\"\",\"curlCmd\":\"\",\"codeCmd\":\"\",\"jsonCmd\":\"\",\"xmlCmd\":\"\",\"lang\":\"\",\"auth\":{\"auth\":\"bearerToken\",\"bearerToken\":\"Bearer 33786|Kw0Du6JtjvAyOFQ9PC2JWbW7ZAighW9xm1kcyeAU\",\"basicUsername\":\"\",\"basicPassword\":\"\",\"customHeader\":\"\",\"encrypted\":\"\"},\"compare\":false,\"idnUrl\":\"https://gymify.app/api/v1/app/client/stats\"}", "sessionId": 1708249045086, "deviceId": "f61617e8-fe6e-4ddf-93de-4ed8b80dc79bR" }
    const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Content-Length': 799,
            'Content-Type': 'application/json',
            'Expires': 0,
            'Origin': 'https://reqbin.com',
            'Pragma': 'no-cache'
        },
        body: JSON.stringify(payload)
    })

    console.log(res.status)
    console.log(res.statusText)
    console.log(res.headers)


    const firstJSON = await res.json()
    const gymData = JSON.parse(firstJSON['Content'])
    return gymData['stats']['peopleInGym']
}



// sources
// https://docs.gymify.app/wp-content/uploads/2022/05/gymify_logo.png


let country = 'de' // für Österreich bitte 'at' verwenden
let storeId = 251
let param = args.widgetParameter
if (param != null && param.length > 0) {
    storeId = param
}

const widget = new ListWidget()
const storeInfo = await fetchStoreInformation()
const storeCapacity = await getPeopleInGym()
await createWidget()

// used for debugging if script runs inside the app
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

// build the content of the widget
async function createWidget() {

    widget.addSpacer(4)
    const logoImg = await getImage('gymify.png')

    widget.setPadding(10, 10, 10, 10)
    const titleFontSize = 12
    const detailFontSize = 36

    const logoStack = widget.addStack()
    logoStack.addSpacer(86)
    const logoImageStack = logoStack.addStack()
    logoStack.layoutHorizontally()
    logoImageStack.backgroundColor = new Color("#ffffff", 1.0)
    logoImageStack.cornerRadius = 8
    const wimg = logoImageStack.addImage(logoImg)
    wimg.imageSize = new Size(125, 40)
    wimg.rightAlignImage()
    widget.addSpacer()

    // const icon = await getImage('toilet-paper.png')
    let row = widget.addStack()
    row.layoutHorizontally()
    // row.addSpacer(2)
    // const iconImg = row.addImage(icon)
    // iconImg.imageSize = new Size(40, 40)
    // row.addSpacer(13)

    let column = row.addStack()
    column.layoutVertically()

    const paperText = column.addText("PEOPLE IN GYM")
    paperText.font = Font.mediumRoundedSystemFont(13)

    const packageCount = column.addText(storeCapacity.toString())
    packageCount.font = Font.mediumRoundedSystemFont(22)
    if (storeCapacity < 5) {
        packageCount.textColor = new Color("#00CD66")
    } else {
        packageCount.textColor = new Color("#E50000")
    }
    widget.addSpacer(4)

    const row2 = widget.addStack()
    row2.layoutVertically()

    // const street = row2.addText(storeInfo.address.street)
    // street.font = Font.regularSystemFont(11)

    // const zipCity = row2.addText(storeInfo.address.zip + " " + storeInfo.address.city)
    // zipCity.font = Font.regularSystemFont(11)

    // let currentTime = new Date().toLocaleTimeString('de-DE', { hour: "numeric", minute: "numeric" })
    // let currentDay = new Date().getDay()
    // let isOpen
    // if (currentDay > 0) {
    //     const todaysOpeningHour = storeInfo.openingHours[currentDay - 1].timeRanges[0].opening
    //     const todaysClosingHour = storeInfo.openingHours[currentDay - 1].timeRanges[0].closing
    //     const range = [todaysOpeningHour, todaysClosingHour];
    //     isOpen = isInRange(currentTime, range)
    // } else {
    //     isOpen = false
    // }

    // let shopStateText
    // if (isOpen) {
    //     shopStateText = row2.addText('Geöffnet')
    //     shopStateText.textColor = new Color("#00CD66")
    // } else {
    //     shopStateText = row2.addText('Geschlossen')
    //     shopStateText.textColor = new Color("#E50000")
    // }
    // shopStateText.font = Font.mediumSystemFont(11)
}


// get images from local filestore or download them once
async function getImage(image) {
    let fm = FileManager.local()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, image)
    if (fm.fileExists(path)) {
        return fm.readImage(path)
    } else {
        // download once
        let imageUrl
        switch (image) {
            case 'gymify.png':
                imageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Dm_Logo.svg/300px-Dm_Logo.svg.png"
                break
            case 'toilet-paper.png':
                imageUrl = "https://i.imgur.com/Uv1qZGV.png"
                break
            default:
                console.log(`Sorry, couldn't find ${image}.`);
        }
        let iconImage = await loadImage(imageUrl)
        fm.writeImage(path, iconImage)
        return iconImage
    }
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}
