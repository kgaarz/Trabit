package com.example.api_test.dataClasses

data class ReportPOST (val author : String,
                       val description : String,
                       val location : LocationObject,
                       val transport : TransportPOST,
                       val metadata : Metadata = Metadata()) {
}