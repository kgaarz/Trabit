package com.example.api_test.dataClasses

data class CreateReport (val author : String,
                         val description : String,
                         val location : LocationObject,
                         val transport : CreateTransport,
                         val metadata : Metadata = Metadata()) {
}