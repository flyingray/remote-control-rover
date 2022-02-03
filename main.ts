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
    for (let an_element2 of [2, 1, 0]) {
        led.plotBrightness(4, an_element2, 0)
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
    led.plotBrightness(4, 0, 255)
    basic.pause(50)
    for (let an_element3 of [0, 1, 2]) {
        led.plotBrightness(4, an_element3, 255)
        basic.pause(50)
    }
    basic.pause(50)
    for (let an_element4 of [0, 1, 2]) {
        led.plotBrightness(4, an_element4, 0)
        basic.pause(50)
    }
}
function process_recv_queue () {
    recv_queue_value = convertToText(recv_queue.shift())
    if (recv_queue_value != "undefined") {
        serial.writeLine("recv:" + ("" + radio.receivedPacket(RadioPacketProperty.SerialNumber)) + "," + ("" + radio.receivedPacket(RadioPacketProperty.SignalStrength)) + "," + recv_queue_value)
        if (recv_queue_value.split(":").shift() == "move") {
            handle_move(recv_queue_value.split(":").pop())
        }
    }
}
function show_bright_image (image2: Image) {
    image2.showImage(0)
    led.setBrightness(200)
}
function recv_message (a_message2: string) {
    recv_queue.push(a_message2)
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
function handle_move (move_params: string) {
    if (move_params.split(",").shift() == "forward") {
        Rover.MotorRunDual(50, 50)
        images.arrowImage(ArrowNames.North).showImage(0)
    } else if (move_params.split(",").shift() == "back") {
        Rover.MotorRunDual(-50, -50)
        images.arrowImage(ArrowNames.South).showImage(0)
    } else if (move_params.split(",").shift() == "left") {
        Rover.MotorRunDual(25, 75)
        images.arrowImage(ArrowNames.West).showImage(0)
    } else if (move_params.split(",").shift() == "right") {
        Rover.MotorRunDual(75, 25)
        images.arrowImage(ArrowNames.East).showImage(0)
    } else {
        Rover.MotorStopAll(MotorActions.Stop)
    }
}
let recv_queue: string[] = []
let recv_queue_value = ""
let send_queue: string[] = []
let snd_queue_value = ""
Rover.MotorStopAll(MotorActions.Stop)
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
