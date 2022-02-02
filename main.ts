function process_send_queue () {
    snd_queue_value = convertToText(send_queue.shift())
    if (snd_queue_value != "undefined") {
        radio.sendString(snd_queue_value)
        serial.writeLine("send:" + snd_queue_value)
    }
}
function draw_out_dot () {
    led.plotBrightness(4, 2, 255)
    basic.pause(50)
    for (let an_element of [2, 1, 0]) {
        led.plotBrightness(4, an_element, 255)
        basic.pause(50)
    }
    basic.pause(50)
    for (let an_element of [2, 1, 0]) {
        led.plotBrightness(4, an_element, 0)
        basic.pause(50)
    }
}
function send_message (a_message: string) {
    send_queue.push(a_message)
    draw_out_dot()
}
input.onButtonPressed(Button.A, function () {
    led.setBrightness(200)
    images.createImage(`
        . . # . .
        . # . # .
        . # # # .
        . # . # .
        . # . # .
        `).showImage(0)
    led.setBrightness(200)
})
function draw_in_dot () {
    let value3: number;
led.plotBrightness(4, 0, 255)
    basic.pause(50)
    for (let an_element of [0, 1, 2]) {
        led.plotBrightness(4, an_element, 255)
        basic.pause(50)
    }
    basic.pause(50)
    for (let an_element of [0, 1, 2]) {
        led.plotBrightness(4, an_element, 0)
        basic.pause(50)
    }
}
function process_recv_queue () {
    recv_queue_value = convertToText(recv_queue.shift())
    if (recv_queue_value != "undefined") {
        serial.writeLine("recv:" + ("" + radio.receivedPacket(RadioPacketProperty.SerialNumber)) + "," + ("" + radio.receivedPacket(RadioPacketProperty.SignalStrength)) + "," + recv_queue_value)
    }
}
function show_bright_image (image2: Image) {
    image2.showImage(0)
    led.setBrightness(200)
}
function recv_message (a_message: string) {
    recv_queue.push(a_message)
    draw_in_dot()
}
radio.onReceivedString(function (receivedString) {
    recv_message(receivedString)
})
input.onButtonPressed(Button.B, function () {
    led.setBrightness(200)
    images.createImage(`
        . # # . .
        . # . # .
        . # # . .
        . # . # .
        . # # . .
        `).showImage(0)
    led.setBrightness(200)
})
function heartbeat () {
    led.setBrightness(200)
    basic.pause(50)
    led.setBrightness(100)
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    led.setBrightness(200)
    images.createImage(`
        . . . . .
        . # # # .
        # . . . #
        . # # # .
        . . . . .
        `).showImage(0)
    led.setBrightness(200)
})
let recv_queue: string[] = []
let recv_queue_value = ""
let send_queue: string[] = []
let snd_queue_value = ""
radio.setTransmitSerialNumber(true)
radio.setGroup(1)
basic.showIcon(IconNames.SmallDiamond)
heartbeat()
basic.forever(function () {
    process_send_queue()
    process_recv_queue()
    basic.pause(50)
    heartbeat()
})
