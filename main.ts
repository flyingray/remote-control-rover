function handle_move_command (move_params: string) {
    if (move_params.split(",").shift() == "forward") {
        Rover.MotorRunDual(150, 150)
        set_current_image(images.arrowImage(ArrowNames.North))
    } else if (move_params.split(",").shift() == "back") {
        Rover.MotorRunDual(-75, -75)
        set_current_image(images.arrowImage(ArrowNames.South))
    } else if (move_params.split(",").shift() == "left") {
        Rover.MotorRunDual(50, 100)
        set_current_image(images.arrowImage(ArrowNames.West))
    } else if (move_params.split(",").shift() == "right") {
        Rover.MotorRunDual(100, 50)
        set_current_image(images.arrowImage(ArrowNames.East))
    } else if (move_params.split(",").shift() == "forward_left") {
        Rover.MotorRunDual(75, 100)
        set_current_image(images.arrowImage(ArrowNames.NorthWest))
    } else if (move_params.split(",").shift() == "forward_right") {
        Rover.MotorRunDual(100, 75)
        set_current_image(images.arrowImage(ArrowNames.NorthEast))
    } else if (move_params.split(",").shift() == "back_left") {
        Rover.MotorRunDual(-75, -100)
        set_current_image(images.arrowImage(ArrowNames.SouthWest))
    } else if (move_params.split(",").shift() == "back_right") {
        Rover.MotorRunDual(-100, -75)
        set_current_image(images.arrowImage(ArrowNames.SouthEast))
    } else {
        Rover.MotorStopAll(MotorActions.Stop)
        set_current_image(images.iconImage(IconNames.Square))
    }
}
function process_send_queue () {
    snd_queue_value = convertToText(send_queue.shift())
    if (snd_queue_value != "undefined") {
        radio.sendString(snd_queue_value)
        serial.writeLine("send:" + snd_queue_value)
    }
}
function draw_out_dot () {
    led.plotBrightness(4, 2, 255)
    for (let an_element of [2, 1, 0]) {
        led.plotBrightness(4, an_element, 255)
    }
    for (let an_element2 of [2, 1, 0]) {
        led.plotBrightness(4, an_element2, 0)
    }
}
function send_message (a_message: string) {
    send_queue.push(a_message)
    draw_out_dot()
}
input.onButtonPressed(Button.A, function () {
    turn_trim_adjust += 1
    set_current_image(images.createImage(`
        . . # . .
        . # . . .
        # . . . .
        . # . . .
        . . # . .
        `))
})
function draw_in_dot () {
    led.plotBrightness(4, 0, 255)
    for (let an_element3 of [0, 1, 2]) {
        led.plotBrightness(4, an_element3, 255)
    }
    for (let an_element4 of [0, 1, 2]) {
        led.plotBrightness(4, an_element4, 0)
    }
}
function set_current_image (image2: Image) {
    current_image = image2
    led.setBrightness(250)
}
function process_recv_queue () {
    recv_queue_value = convertToText(recv_queue.shift())
    if (recv_queue_value != "undefined") {
        serial.writeLine("recv:" + ("" + radio.receivedPacket(RadioPacketProperty.SerialNumber)) + "," + ("" + radio.receivedPacket(RadioPacketProperty.SignalStrength)) + "," + recv_queue_value)
        if (recv_queue_value.split(":").shift() == "move") {
            handle_move_command(recv_queue_value.split(":").pop())
        } else if (recv_queue_value.split(":").shift() == "hat_click") {
            Rover.MotorStopAll(MotorActions.Stop)
            set_current_image(images.iconImage(IconNames.Square))
        } else {
        	
        }
    }
}
function recv_message (a_message2: string) {
    recv_queue.push(a_message2)
    draw_in_dot()
}
radio.onReceivedString(function (receivedString) {
    recv_message(receivedString)
})
input.onButtonPressed(Button.B, function () {
    turn_trim_adjust += -1
    set_current_image(images.createImage(`
        . . # . .
        . . . # .
        . . . . #
        . . . # .
        . . # . .
        `))
})
function heartbeat () {
    current_image.showImage(0)
    heartbeat_count += 1
    if (heartbeat_count % 4 == 0) {
        if (heartbeat_count / 4 % 2 == 0) {
            led.setBrightness(250)
        } else {
            led.setBrightness(100)
        }
    }
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    turn_trim_adjust = 0
    set_current_image(images.createImage(`
        . . . . .
        . # # # .
        # . . . #
        . # # # .
        . . . . .
        `))
})
function handle_move (move_params: string) {
	
}
let recv_queue: string[] = []
let recv_queue_value = ""
let send_queue: string[] = []
let snd_queue_value = ""
let current_image: Image = null
let heartbeat_count = 0
let turn_trim_adjust = 0
Rover.MotorStopAll(MotorActions.Stop)
radio.setTransmitSerialNumber(true)
radio.setGroup(1)
let move_speed = 150
turn_trim_adjust = 0
heartbeat_count = 0
current_image = images.iconImage(IconNames.SmallDiamond)
led.setBrightness(200)
basic.forever(function () {
    process_send_queue()
    process_recv_queue()
    heartbeat()
})
