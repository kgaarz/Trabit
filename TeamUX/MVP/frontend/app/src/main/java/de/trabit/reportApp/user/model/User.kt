package com.example.api_test.dataClasses

import de.trabit.reportApp.user.model.Mobility
import de.trabit.reportApp.user.model.Profile
import java.util.*

data class User (val _id : String,
                 val username : String,
                 val password : String,
                 val profile : Profile,
                 val mobility : Mobility,
                 val created : Date,
                 val modified : Date) {
}