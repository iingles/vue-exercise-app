<template>
    <header class="py-4 mb-5 main-header">
        <b-container>
            <b-row class="justify-content-between">
                
                <b-col cols="3 px-0">
                    <router-link :to="'/'"><h1>Isaac's Exercise App</h1></router-link>
                </b-col>

                <b-col cols="3 px-0">
                    <nav class="main-nav">
                        <router-link :to="'/add-exercise'">Add Exercise</router-link>
                        <router-link :to="'/track-exercise'">Track</router-link>

                    </nav> 
                </b-col>
         
            </b-row>
           
        </b-container>
    </header>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
    .main-header {
        color: #fff;
        background: #000;

        a {
            color: #fff;
        }

        .container {

            .main-nav {
                a {
                    margin-right: 1rem;                    
                    font-size: 1.6rem;
                
                    &:last-child {
                        margin-right: unset;
                    }
                }
            }
        }
    }
</style>