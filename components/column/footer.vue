<template lang="pug">
  .column-footer-component(:class="{ 'opened': isOpened, 'no-margin': !margin }")
    commonButton.button(
      v-if="!isOpened"
      type="ghost"
      size="large"
      @click.prevent="toggle") + Add card
    addForm(
      v-else
      v-model="newCard.title"
      exception="add-button"
      placeholder="Enter a title for new card..."
      @submit="createCard"
      @close="close") Add card
</template>

<script>
import addForm from '@/components/add-form'

export default {
  name: 'column-footer-component',
  components: {
    addForm
  },
  props: {
    columnId: String,
    margin: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isOpened: false,
      newCard: this.$models.create('card')
    }
  },
  watch: {
    isOpened () {
      this.newCard.reset()
    }
  },
  mounted () {
    this.$root.$on('keyup', this.handleKeyup)
  },
  beforeDestroy () {
    this.$root.$off('keyup')
  },
  methods: {
    handleKeyup (key) {
      if (key === 'esc') {
        this.close()
      }
    },
    toggle () {
      this.isOpened = !this.isOpened
    },
    close () {
      this.isOpened = false
    },
    createCard () {
      this.newCard.update({
        column: this.columnId
      })
      this.$store.dispatch('api/createCard', this.newCard).then(res => {
        this.$emit('create', res)
        this.newCard.reset()
      })
    }
  }
}
</script>

<style lang="scss">
  .column-component.column-empty {
    .column-footer-component {
      padding-top: 0;
      &:hover,
      &.opened {
        margin-top: -10px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  $padding: 10px;
  .column-footer-component {
    position: relative;
    padding: $padding;
    margin-top: -$padding;
    transition: $transition-default;
    .button {
      width: 100%;
    }
    &:not(.no-margin) {
      &:hover,
      &.opened {
        margin-top: 0;
      }
    }
  }
</style>
