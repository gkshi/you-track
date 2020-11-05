  <template lang="pug">
    common-modal.card-modal(id="card" @close="onClose")
      header
        editableArea.h1(
          type="light"
          v-model="card.title"
          placeholder="Enter a title for this card..."
          @change="update")
        .subtitle
          div In list "{{ columnTitle }}"

      .intro.flex.a-start
        article.grow
          section
            .section-title Labels:
            card-label-bar(:board="board" :card="card")

          section
            .section-title Description:
            .description.flex
              editable-area.grow(
                v-model="card.description"
                placeholder="Add a more detailed description..."
                @change="update"
                textarea)

          card-section-files

        // aside.shrink
          div aside
  </template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'card-modal',
  props: {
    board: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      card: this.$models.create('card')
    }
  },
  computed: {
    ...mapState({
      activeCard: state => state.activeCard
    }),
    ...mapGetters([
      'column'
    ]),
    columnTitle () {
      const column = this.column(this.card.column)
      return column ? column.title : ''
    }
  },
  watch: {
    activeCard: {
      handler () {
        this.card.update(this.activeCard)
      },
      deep: true
    },
    card: {
      handler () {
        this.$emit('update', this.card)
      },
      deep: true
    }
  },
  created () {
    this.card.update(this.activeCard)
  },
  methods: {
    async update () {
      await this.$store.dispatch('api/updateCard', this.card)
      this.$emit('update', this.card)
    },
    onClose () {
      this.$store.dispatch('changeActiveCard', null)
    }
  }
}
</script>

  <style lang="scss" scoped>
    .card-modal {
      .intro {
        & > article {
          //
        }
        & > aside {
          width: 180px;
          margin-left: 32px;
        }
      }

      ::v-deep .section-title {
        margin-bottom: 8px;
        font-size: $font-size-smaller;
        line-height: $line-height-smaller;
        color: $color-text-light;
      }

      header {
        margin-right: 20px;
        margin-bottom: 20px;

        ::v-deep .h1 {
          input {
            font-weight: $font-weight-semibold;
          }
        }
      }

      .subtitle {
        margin-top: 8px;
        font-size: $font-size-small;
        line-height: $line-height-small;
        color: $color-text-light;
      }

      section {
        &:not(:last-child) {
          margin-bottom: 32px;
        }
      }

      .description {
        min-height: 100px;
        .area {
          height: 100%;
        }
        ::v-deep .preview,
        ::v-deep textarea {
          padding: 8px 10px;
        }
      }
    }
  </style>
