<template lang="pug">
  .card-component(:class="{ 'options-opened': isOpened }" :data-id="data._id")
    .intro(@click="open")
      .title {{ data.title }}
      .description(v-if="data.description") {{ data.description }}
    contextMenu.options(@open="onOpen" @close="onClose")
      a(href="#" @click.prevent="open") Open card
      a(href="#" @click.prevent="remove") Remove card
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
      isOpened: false
    }
  },
  methods: {
    open () {
      this.$store.dispatch('changeActiveCard', this.data._id)
      this.openModal('card')
    },
    async remove () {
      const res = await this.$store.dispatch('api/removeCard', this.data._id).catch(() => null)
      if (res) {
        this.$emit('remove', this.data._id)
      }
    },
    onOpen () {
      // для column/index.vue, блокируем скролл в родителе
      this.$root.$emit('disableColumnScroll')
    },
    onClose () {
      // для column/index.vue, разблокируем скролл в родителе
      this.$root.$emit('enableColumnScroll')
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-component {
    @extend %content-block;
    padding: 0;
    position: relative;
    border: 2px solid $color-content-bg;
    border-radius: $border-radius-default;
    cursor: pointer;

    .intro {
      padding: 14px 16px 15px;
    }

    .title {
      padding-right: 20px;
      font-size: $font-size-smaller;
      line-height: $line-height-smaller;
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
      border: 2px dashed rgba($color-text-light, .3);
      background: transparent;
      box-shadow: none;
      & > * {
        opacity: 0;
      }
    }
    &.sortable-drag {
      transform: rotate(4deg);
    }
    &[class*="sortable-ghost"],
    &[class*="sortable-drag"] {
      .options {
        display: none;
      }
    }
  }
</style>
