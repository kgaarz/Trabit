package com.example.api_test.dataClasses

data class ReportPOST (val author : String,
                       val description : String,
                       val location : LocationObject,
                       val transport : Transport,
                       val metadata : Metadata = Metadata()) {
}