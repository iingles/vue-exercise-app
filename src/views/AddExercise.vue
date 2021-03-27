<template>

    <b-row class="page-content">
        <b-col cols="12" class="px-0 my-3">
            {{ todaysDate }}
        </b-col>
        <b-col cols="12" lg="4">
            <form @submit.prevent="addExercise()" class="add-exercise">

                <b-row class="form-group flex-column">

                    <label for="exercise-select">Select Exercise</label>
                    <select name="exercise-select" id="exerciseSelect" v-model="selectedExercise">
                        <option v-for="(exercise, key) in exerciseList" :key="key" :value="exercise">{{ exercise.name }}</option>
                    </select>

                </b-row>

                <b-row v-if="selectedExercise !== null">

                    <b-col cols="12" v-for="(property, key) in selectedExercise" :key="key">

                        <b-row>

                            <b-col v-if="key === 'name'" class="px-0">
                                <h2>{{ property.toUpperCase() }}</h2>
                            </b-col>

                            <b-col class="d-flex flex-column mb-4 px-0" v-else>

                                <label :for="`${ formatExerciseName }-${key}`">{{ key }}</label>
                                <template v-if="key === 'time'">
                                    <p>Must use format: hh:mm:ss.SS</p>
                                    <input type="text" :name="`${ formatExerciseName }-${key}`" v-model="selectedExercise.time" step="2"/>    
                                </template>

                                <template v-else>
                                    <input type="number" :name="`${ formatExerciseName }-${key}`" v-model="selectedExercise[key]" value="0" />    
                                </template>

                            </b-col>

                        </b-row>
                    
                    </b-col>

                    <b-col cols="12" class="px-0">
                        <button class="exercise-button" type="submit">Add</button>
                    </b-col>

                </b-row>

                
            </form>
        </b-col>
        

        <b-col cols="12" lg="4">

            <h2>Today's exercises:</h2>
            <template v-if="todaysExercises.length > 0">
                <div class="card mb-5" v-for="(exercise, key, index) in todaysExercises" :key="key">
                    <p v-for="(property, propKey) in exercise" :key="propKey">{{ propKey }} : {{ property }}</p>
                    <button @click="deleteItem(exercise, index)" class="exercise-button">Delete</button>
                </div>
            </template>

        </b-col>

    </b-row>


</template>

<script>
export default {
    data: () => ({
        selectedExercise: null,

        exerciseList: [
            { name: 'running', time: '' },
            { name: 'bench press', sets: '', reps: '', weight: ''},
            { name: 'curls', sets: '', reps: '', weight: ''},
            { name: 'crunches', sets: '', reps: '' },
            { name: 'flutter kicks', reps: '' },
            { name: 'shoulder press', sets: '', reps: '', weight: '' },
            { name: 'lat pulldown', sets: '', reps: '', weight: ''},
            { name: 'pullups', sets: '', reps: '' },
            { name: 'squats', sets: '', reps: '', weight: '' },
            { name: 'lunges', sets: '', reps: '', weight: ''},
            { name: 'calf raises', sets: '', reps: '', weight: ''}
        ],

        todaysExercises: []
    }),

    mounted() {        
        this.getTodaysExercises()
    },

    computed: {       

        formatExerciseName() { return  this.selectedExercise.name.split(' ').join('-') },
 
        todaysDate() { 
            const now = Date.now()
            const d = new Date(now)         

            return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`
        }
    },    

    methods: {
        getTodaysExercises() {
            const vm = this
            const items = this.$store.state.exercises
            vm.todaysExercises = []

            // If there are no exercises in the store
            if ( ( Object.keys(items).length === 0) ) {                  
                return 
            }

            for (let ex in items) {
                if ( items[ex].some( el => el.date === vm.todaysDate ) ) {
                    const exIdx = items[ex].findIndex(el => el.date === vm.todaysDate)
                    vm.todaysExercises.push(items[ex][exIdx])
                }
            }
        },

        addExercise() {
            const vm = this
            const exName = vm.selectedExercise.name

            // If the exercise has already been added today, don't add a new one
            if ( (exName in this.$store.state.exercises )) {
                if (this.$store.state.exercises[exName].some(el => el.date === vm.todaysDate)) {
                    vm.selectedExercise = null
                    return alert("Can only add an exercise once per day")
                }
            }

            vm.todaysExercises.push({date: vm.todaysDate, ...vm.selectedExercise})
             
            this.$store.commit('ADD_EXERCISE', {date: vm.todaysDate, ...vm.selectedExercise})

            vm.selectedExercise = null
        },

        deleteItem(item, index) {
            const vm = this

            // Remove the item from the store (in a live app I'd have an action to handle the database side)
            vm.$store.commit('DELETE_EXERCISE', item)
            
            // Remove the item from the current component's array
            vm.todaysExercises.splice(index, 1)
        }

    }
}
</script>

<style scoped lang="scss">
    .exercise-button {
        padding: 0.5rem 2rem;
        background: #000;
        border: none;
        border-radius: 2rem;
        color: #fff;
        font-size: 1.6rem;
    }
</style>