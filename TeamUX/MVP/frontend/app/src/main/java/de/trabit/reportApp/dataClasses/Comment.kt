package com.example.api_test.dataClasses

import java.util.*

data class Comment (val _id : String,
                    val author : String,
                    val content : String,
                    val metadata : Metadata,
                    val created : Date){
}