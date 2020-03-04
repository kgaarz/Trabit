package com.example.api_test.dataClasses

import de.trabit.reportApp.shared.Votable
import java.util.*

class Comment (_id : String = "",
               val author : String = "",
               val content : String = "",
               metadata : Metadata = Metadata(),
               val created : Date = Date(),
               resourceName : String = "comments") : Votable(_id, metadata, resourceName) {
}