package de.trabit.reportApp.user.model

data class Mobility (val car : Boolean,
                     val driversLicense : Boolean,
                     val bike : Boolean,
                     val trainTicket : Boolean,
                     val sharing : Boolean){
}