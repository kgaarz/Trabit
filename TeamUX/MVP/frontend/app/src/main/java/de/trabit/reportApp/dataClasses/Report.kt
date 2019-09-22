package com.example.api_test.dataClasses

import java.util.*
import kotlin.collections.ArrayList

data class Report (val id : String,
                    val author : String,
                    val description : String,
                    val location : LocationObject,
                    val transport : Transport,
                    val metadata : Metadata,
                    val comments : ArrayList<Comment>,
                    val created : Date,
                    val modified : Date) {
}