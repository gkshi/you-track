<template lang="pug">
  .column-component.flex
    .header.flex.j-between
      div {{ data.title }}
      div
        a(href="#" @click.prevent="removeColumn") remove
    .scroll-parent.grow
      .tasks
        boardTask.task(
          v-for="task in data.tasks"
          :data="task"
          :key="task._id")
        div
          a(v-if="!taskCreationOpened" href="#" @click.prevent="toggleTaskCreation") +add task
          div(v-else)
            commonInput(v-model="task.title" placeholder="Heading")
            .buttons
              commonButton(@click="createTask" :disabled="!task.title") Add
              commonButton(type="light" @click="toggleTaskCreation") Cancel
</template>

<script>
import boardTask from '@/components/task'

export default {
  name: 'column-component',
  components: {
    boardTask
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      taskCreationOpened: false,
      task: {
        title: ''
      }
    }
  },
  watch: {
    taskCreationOpened () {
      this.task.title = ''
    }
  },
  methods: {
    toggleTaskCreation () {
      console.log('toggle')
      this.taskCreationOpened = !this.taskCreationOpened
    },
    createTask () {
      this.$store.dispatch('api/createTask', {
        column: this.data._id,
        data: {
          title: this.task.title
        }
      }).then(res => {
        this.data.tasks.push(res)
        this.toggleTaskCreation()
      })
    },
    removeColumn () {
      this.$store.dispatch('api/removeColumn', this.data._id).then(() => {
        this.$emit('remove', this.data._id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .column-component {
    padding: 10px;
    background: #f8f8f8;
    .header {
      font-weight: $font-weight-bold;
      margin-bottom: 20px;
    }
    .tasks {
      .task {
        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
