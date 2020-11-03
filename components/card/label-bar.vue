<template lang="pug">
  .card-label-bar-component.inline-flex.column
    // card selected labels
    .flex.a-center(@click="toggle")
      label-bar.selected-bar(v-show="cardLabels.length" :data="cardLabels")
      common-button.plus(type="light" size="icon")
        icon-plus

    // all board labels
    transition
      .dropdown(v-if="isOpened" v-outside="close")
        div Board labels:
        label-feature.label(
          v-for="label in board.labels"
          :data="label"
          :selected="card.labels.includes(label._id)"
          :key="label._id"
          @click="toggleLabel(label._id)"
          @edit="onLabelEdit(label._id)")
        .add-label-button(@click="onLabelCreate") Create new label

        // edit label popup
        transition
          .popup(v-if="(isEditing || isCreating) && activeLabel" v-outside="closePopup")
            div
              common-input(
                v-model="activeLabel.title"
                placeholder="Enter a label title..."
                autofocus)
            color-picker-simple.color-picker(v-model="activeLabel.color")
            .buttons.flex.a-center
              template(v-if="isCreating")
                common-button(size="small" @click="createLabel" :disabled="isLoading") Create
                common-button(type="light" size="small" @click="closePopup") Cancel
              template(v-else)
                common-button(size="small" @click="updateLabel" :disabled="isLoading") Save
                common-button(type="light" size="small" @click="closePopup") Cancel
                common-button(type="icon" size="icon" @click="removeLabel" :disabled="isLoading")
                  icon-trash
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    board: {
      type: Object,
      default: () => ({})
    },
    card: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isOpened: false,
      isEditing: false,
      isCreating: false,
      isLoading: false,
      activeLabel: null
    }
  },
  computed: {
    ...mapGetters([
      'activeBoard'
    ]),
    cardLabels () {
      const labels = []
      this.card.labels.forEach(id => {
        const label = this.board.labels.find(i => i._id === id)
        labels.push(this.$models.create('label', label))
      })
      return labels
    }
  },
  watch: {
    isOpened (isOpened) {
      if (!isOpened) {
        this.closePopup()
      }
    }
  },
  methods: {
    toggle () {
      this.isOpened = !this.isOpened
    },
    close () {
      this.isOpened = false
    },
    toggleLabel (id) {
      if (this.isEditing) {
        this.closePopup()
        return
      }

      this.$store.dispatch('api/toggleLabel', {
        label: id,
        card: this.card._id
      })

      if (this.card.labels.includes(id)) {
        this.card.labels = this.card.labels.filter(i => i !== id)
      } else {
        const label = this.board.labels.find(i => i._id === id)
        this.card.labels = [...this.card.labels, label._id]
      }
    },
    async createLabel () {
      this.isLoading = true
      const label = await this.$store.dispatch('api/createLabel', {
        board: this.board._id,
        label: this.activeLabel
      })

      // Update existing labels data
      this.$store.dispatch('changeActiveBoard', {
        ...this.activeBoard,
        labels: [...this.activeBoard.labels, label]
      })
      this.board.labels.push(label)

      this.isLoading = false
      this.closePopup()
    },
    async updateLabel () {
      this.isLoading = true

      // Send request for label update
      await this.$store.dispatch('api/updateLabel', {
        board: this.board._id,
        data: this.activeLabel
      })

      // Update existing labels data
      const updatedLabels = [...this.activeBoard.labels]
      const targetIndex = updatedLabels.findIndex(i => i._id === this.activeLabel._id)
      updatedLabels.splice(targetIndex, 1, { ...this.activeLabel })
      this.$store.dispatch('changeActiveBoard', {
        ...this.activeBoard,
        labels: updatedLabels
      })
      const original = this.board.labels.find(i => i._id === this.activeLabel._id)
      Object.keys(this.activeLabel).forEach(key => {
        original[key] = this.activeLabel[key]
      })

      // Close editing popup
      this.isLoading = false
      this.closePopup()
    },
    async removeLabel () {
      this.isLoading = true

      // Send request for label update
      await this.$store.dispatch('api/removeLabel', {
        board: this.board._id,
        label: this.activeLabel._id
      })

      // Update existing labels data
      this.$store.dispatch('changeActiveBoard', {
        ...this.activeBoard,
        labels: this.activeBoard.labels.filter(i => i._id !== this.activeLabel._id)
      })
      this.board.labels = this.board.labels.filter(i => i._id !== this.activeLabel._id)
      this.card.labels = this.card.labels.filter(i => i !== this.activeLabel._id)
      this.$root.$emit('remove-label', this.activeLabel._id)

      // Close editing popup
      this.isLoading = false
      this.closePopup()
    },
    closePopup () {
      this.isCreating = false
      this.isEditing = false
    },
    onLabelEdit (id) {
      this.activeLabel = { ...this.board.labels.find(i => i._id === id) }
      this.isEditing = true
    },
    onLabelCreate () {
      this.activeLabel = this.$models.create('label')
      this.isCreating = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-label-bar-component {
    position: relative;

    .selected-bar {
      margin-right: 8px;
    }

    .dropdown {
      @extend %popup;
      position: absolute;
      bottom: -10px;
      left: 0;
      z-index: 10;
      min-width: 320px;
      transform: translate(0, 100%);

      &.v-enter,
      &.v-leave-active {
        opacity: 0;
        transform: translate(0, calc(100% - 4px));
      }
    }

    .add-label-button {
      @extend %label;
      margin-top: 8px;
      background: $color-bg;
      border-radius: $border-radius-label;
      padding: 9px 0 11px 32px;
      color: $color-text-regular;
    }

    .label {
      margin-top: 6px;
    }

    .popup {
      @extend %popup;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 11;
      width: 226px;
      transform: translate(-50%, -50%);

      &:after {
        content: '';
        position: absolute;
      }

      &.v-enter,
      &.v-leave-active {
        opacity: 0;
        transform: translate(-50%, -50%) scale(.95);
      }
    }

    .color-picker {
      margin: 16px 0 32px;
    }
  }
</style>
