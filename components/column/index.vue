<template lang="pug">
  .column-component.flex
    .header.flex.a-center.j-between.shrink
      div {{ data.title }}
      contextMenu
        a(href="#" @click.prevent) Rename
        a(href="#" @click.prevent="removeColumn") Remove
    .scroll-parent.grow(ref="scrollParent")
      .cards
        boardCard.card(
          v-for="card in data.cards"
          :data="card"
          :key="card._id")
    .footer.shrink
      commonButton.add-button(
        v-if="!cardCreationOpened"
        type="ghost"
        size="full"
        @click.prevent="toggleCardCreation") Add card
      addForm(
        v-else
        v-model="card.title"
        exception="add-button"
        placeholder="Enter a title for this card..."
        @submit="createCard"
        @close="closeCardCreation") Add card
</template>

<script>
import contextMenu from '@/components/context-menu'
import boardCard from '@/components/card'
import addForm from '@/components/add-form'

export default {
  name: 'column-component',
  components: {
    contextMenu,
    boardCard,
    addForm
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      cardCreationOpened: false,
      card: {
        title: ''
      }
    }
  },
  watch: {
    cardCreationOpened () {
      this.card.title = ''
      // if (this.cardCreationOpened) {
      //   this.$nextTick(() => {
      //     this.$refs.addCardTitle.focus()
      //   })
      // }
    }
  },
  methods: {
    toggleCardCreation () {
      this.cardCreationOpened = !this.cardCreationOpened
    },
    closeCardCreation () {
      this.cardCreationOpened = false
    },
    scrollColumn () {
      this.$nextTick(() => {
        this.$refs.scrollParent.scrollTop = this.$refs.scrollParent.scrollHeight
      })
    },
    createCard () {
      this.$store.dispatch('api/createCard', {
        column: this.data._id,
        data: {
          title: this.card.title
        }
      }).then(res => {
        this.data.cards.push(res)
        this.card.title = ''
        this.scrollColumn()
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
    max-height: 100%;
    padding: 10px;
    background: $color-light;
    color: $color-text-regular;
    border-radius: $border-radius-default;
    box-shadow: $box-shadow-deep;
    cursor: pointer;
    .header {
      font-weight: $font-weight-bold;
      margin-bottom: 20px;
      padding-left: 10px;
    }
    .cards {
      .card {
        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
    }
    .footer {
      padding-top: 10px;
    }
    .add-button {
      width: 100%;
    }

    &.ghost-block {
      & > * {
        opacity: 0;
      }
    }
  }
</style>
