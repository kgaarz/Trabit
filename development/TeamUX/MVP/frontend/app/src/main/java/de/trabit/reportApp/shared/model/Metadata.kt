package com.example.api_test.dataClasses

data class Metadata (var upvotes : Votes = Votes(),
                     var downvotes : Votes = Votes(),
                     val active : Boolean = true,
                     val verified : Boolean = false){
}