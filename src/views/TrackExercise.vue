<template>

    <div class="page-content">

        <template v-if="numExercises > 0">
            <b-row cols="12" cols-lg="3" class="flex-column">
                <label for="user-exercises">Select an exercise to track:</label>
                <select name="user-exercises" id="userExercises" @change="getExcerciseData" v-model="selectedExercise">
                    <option value="" disabled selected>Select an exercise...</option>
                    <option v-for="(exercise, key) in exercises" :key="key" :value="exercise">{{ exercise }}</option>
                </select>
                
                <template v-if="selectedExercise !== ''">
                    <label for="user-exercises">Select a starting date:</label>
                    <select name="date-range" id="dateRange" @change="getExcerciseData" v-model="startDate">
                        <option value="" disabled selected>Select a starting date...</option>
                        <option v-for="(date, key) in exerciseDates" :key="key" :value="date">{{ date }}</option>
                    </select>
                </template>
                
            </b-row>
            
            <b-row v-if="chartData">
                <line-chart 
                :chart-data="chartData"
                :options="chartOptions"
                v-if="selectedExercise != null"
                />
            </b-row>

        </template>

        <h2 v-else>Please add an exercise to be able to track it!</h2>
       
    </div>

</template>

<script>
import LineChart from '@/components/charts/LineChart'

export default {
    components: {
        LineChart
    },

    data: ()=> ({
        selectedExercise: '',
        exercises: [],
        startDate: '',
        chartData: null, 
        exerciseDates: [],

        chartOptions: {
            responsive: true,
            maintainAspectRatio: false
        }
    }),

    mounted() {
        const vm = this

        if (vm.numExercises > 0) {
            vm.loadExercises()
        }
    },

    computed: {
        numExercises() {
            const exState = this.$store.state.exercises
            return Object.keys(exState).length
        },

        selectedItem() {
            if ( this.selectedExercise !== null ) return this.selectedExercise.name
        },
    },

    watch: {
        selectedItem() {
            this.getExcerciseData()
        }
    },

    methods: {
        loadExercises() {
            const exState = this.$store.state.exercises
            const vm = this

            if ( !(vm.numExercises > 0) ) return

            for (let property in exState) {
                vm.exercises.push(property)
            }
        },

        getExcerciseData() {
            // There's probably a more elegant way to handle all of this.
            const vm = this
            vm.exerciseDates = []

            const exerciseData = this.$store.state.exercises[vm.selectedExercise]
            
            exerciseData.sort( (a,b) => {
                return new Date(b.date) - new Date(a.date)
            }).reverse()


            for (let i = 0; i < exerciseData.length; i++) {
                vm.exerciseDates.push(exerciseData[i].date)
            }

            // Only display max of 10 days
            const selectedDateIdx = vm.exerciseDates.indexOf(vm.startDate)

            const numAfterSelected = vm.exerciseDates.length - selectedDateIdx

            const dates = vm.exerciseDates.slice(selectedDateIdx, vm.exerciseDates[-1])

            vm.chartData = {
                labels: dates,
                datasets: []
            }

            // Just grab the properties from the first object to populate the labels (they should all be the same, right?)

            for(let property in exerciseData[0]) {
                    const borderColor = vm.hexCode()

                if (exerciseData[0].hasOwnProperty(property)) {

                    if ( property !== "name" && property !== "date"){

                        vm.chartData.datasets.push({
                            label: property,
                            borderColor,
                            fill: false,
                            data: []
                         })
                    }
                }
            }

            // Set options for axes (different for time/quantity)

            if ( vm.selectedExercise === 'running') {


                vm.chartOptions.scales = {
                    xAxes: [
                        {
                            type: 'time',
                            time: {
                                parser: 'MM/DD/YY',
                                unit: 'day',
                                unitStepSize: 1,
                            }
                        }
                    ],

                    yAxes: [
                        {
                            type: 'linear',
                            ticks: {
                                // Use milliseconds as tick size
                                min: 0,
                                max: 7200000, // 1 hour 
                                stepSize: 60000, // 1 minute

                                callback: val => {

                                    let milliseconds = parseInt( (val % 1000) / 100),

                                    seconds = Math.floor( (val / 1000) % 60),
                                    minutes = Math.floor( (val / (1000 * 60) ) % 60),
                                    hours = Math.floor( (val / (1000 * 60 * 60)) % 24)

                                    hours = (hours < 10) ? `0${hours}` : hours;
                                    minutes = (minutes < 10) ? `0${minutes}` : minutes
                                    seconds = (seconds < 10) ? `0${seconds}` : seconds

                                    return `${hours}:${minutes}:${seconds}.${milliseconds}`
                                    
                                }
                            }
                        }
                    ]
                }
            }

             if ( vm.selectedExercise !== 'running') {
                vm.chartOptions.scales = {
                        xAxes: [
                            {
                                type: 'time',
                                time: {
                                    unit: 'day'
                                }
                            }
                        ],
                        yAxes: [
                        {
                            type: 'linear'
                        }
                    ]
                }
            }
            
            // Now go through each exercise and populate the data
            for(let j = selectedDateIdx; j < vm.exerciseDates.length; j++) {

                for(let property in exerciseData[j]) {

                    const e = vm.chartData.datasets.find(el => el.label === property)

                    if ( property !== "name" && property !== "date"  && property !== "time") {
                        e.data.push(exerciseData[j][property])   
                    }

                    if ( property === "time" ) {
                        const ms = vm.convertToMs(exerciseData[j][property])
                        e.data.push(ms) 
                    }

                }
            }
        },

        convertToMs( timeString ) {
            const parts = timeString.split(':')

            const hours = parseInt(parts[0]) * 1000 * 60 * 60
            const minutes = parseInt(parts[1]) * 1000 * 60
            const seconds = parseInt(parts[2].split('.')[0]) * 1000
            const ms = parseInt(parts[2].split('.')[1])

            return hours + minutes + seconds + ms
            
        },

        hexCode() {
            // Generate random RGB values
            const r = Math.floor(Math.random() * 256)
            const g = Math.floor(Math.random() * 256)
            const b = Math.floor(Math.random() * 256)

            return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`   
        },

        randomInts() {
            let array = []

            for(let i = 0; i < 7; i++) {
                const rand = Math.floor(Math.random() * 100) + 1
                array.push(rand)
            }

            return array
        }

    }
}
</script>

<style>

</style>