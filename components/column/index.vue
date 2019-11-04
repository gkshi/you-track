<template lang="pug">
  .column-component.flex
    .header.flex.j-between
      div {{ data.title }}
      div
        a(href="#" @click.prevent="removeColumn") remove
    .scroll-parent
      .cards
        boardCard.card(
          v-for="card in data.cards"
          :data="card"
          :key="card._id")
        div
          commonButton.add-button(
            v-if="!cardCreationOpened"
            type="ghost"
            size="full"
            @click.prevent="toggleCardCreation") Add card
          form.add-form(v-else @submit.prevent="createCard")
            commonInput(ref="addCardTitle" v-model="card.title" placeholder="Enter a title for this card...")
            .buttons.flex.a-center
              commonButton(size="small" native="submit" :disabled="!card.title") Add card
              commonButton(size="square" type="ghost" @click="toggleCardCreation")
                iconCross
</template>

<script>
import boardCard from '@/components/card'
import iconCross from '@/components/icons/cross'

export default {
  name: 'column-component',
  components: {
    boardCard,
    iconCross
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
      if (this.cardCreationOpened) {
        this.$nextTick(() => {
          this.$refs.addCardTitle.focus()
        })
      }
    }
  },
  methods: {
    toggleCardCreation () {
      this.cardCreationOpened = !this.cardCreationOpened
    },
    closeCardCreation (key) {
      if (key === 'esc') {
        this.cardCreationOpened = false
      }
    },
    createCard () {
      this.$store.dispatch('api/createCard', {
        column: this.data._id,
        data: {
          title: this.card.title
        }
      }).then(res => {
        this.data.cards.push(res)
        this.toggleCardCreation()
      })
    },
    removeColumn () {
      this.$store.dispatch('api/removeColumn', this.data._id).then(() => {
        this.$emit('remove', this.data._id)
      })
    }
  },
  mounted () {
    this.$root.$on('keyup', this.closeCardCreation)
  },
  beforeDestroy () {
    this.$root.$off('keyup', this.closeCardCreation)
  }
}
</script>

<style lang="scss">
  .column-component {
    .add-form {
      input {
        &:focus {
          box-shadow: $box-shadow-light-hover;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .column-component {
    padding: 10px;
    background: $color-light;
    color: $color-text-regular;
    border-radius: $border-radius-default;
    box-shadow: $box-shadow-deep;
    .header {
      font-weight: $font-weight-bold;
      margin-bottom: 20px;
    }
    .cards {
      .card {
        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
    }
    .add-button {
      width: 100%;
    }
    .add-form {
      .buttons {
        margin-top: 10px;
      }
    }
  }
</style>
