<template lang="pug">
  .card-component(:class="{ 'options-opened': isOptionsOpened }" :data-id="data._id")
    .intro(@click="open")
      div {{ data.title }}
    contextMenu.options(@open="onOptionsOpen" @close="onOptionsClose")
      a(href="#" @click.prevent="remove") Remove
</template>

<script>
import contextMenu from '@/components/context-menu'

export default {
  name: 'card-component',
  components: {
    contextMenu
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isOptionsOpened: false
    }
  },
  methods: {
    onOptionsOpen () {
      this.isOptionsOpened = true
    },
    onOptionsClose () {
      this.isOptionsOpened = false
    },
    open () {
      this.$store.dispatch('changeActiveCard', this.data._id)
      this.openModal('card')
    },
    remove () {
      this.$store.dispatch('api/removeCard', this.data._id).then(() => {
        this.$emit('remove', this.data._id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-component {
    position: relative;
    padding: 10px 12px 20px;
    border-radius: $border-radius-default;
    background: $color-white;
    box-shadow: $box-shadow-light;
    transition: $transition-card;
    cursor: pointer;
    &:hover {
      background: darken($color-white, 1%);
      box-shadow: $box-shadow-light-hover;
    }

    .options {
      position: absolute;
      top: 10px;
      right: 10px;
      opacity: 0;
      visibility: hidden;
    }

    &:hover,
    &.options-opened {
      .options {
        opacity: 1;
        visibility: visible;
      }
    }

    &.sortable-ghost {
      background: $color-bg;
      box-shadow: none;
      & > * {
        opacity: 0;
      }
    }
    &.sortable-drag {
      transform: rotate(4deg);
    }
  }
</style>
