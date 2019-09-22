package com.example.api_test.dataClasses

data class ReportRequestParameters (val orignCity : String,
                                    val transportType : String,
                                    val transportTag : String? = null,
                                    val destinationCity : String? = null) {
}