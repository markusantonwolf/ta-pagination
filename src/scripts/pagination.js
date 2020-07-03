function pagination() {
  return {
    page: 1,
    pagination: 5,
    elements: [],
    visible: [],
    initialized: false,
    is_expand: false,
    is_shrink: false,
    has_next: false,
    has_previous: false,
    animating: false,
    default: {
      page: 1,
      pagination: 5,
      content: 'content',
      navigation: 'navigation',
      item: 'pagination__item',
      animation: 'pagination__anim',
      hidden: 'pagination__item--hidden',
      visible: 'pagination__item--visible',
      lazy: 'pagination__lazy',
      breakpoints: [
        { width: '768', pagination: '2' },
        { width: '640', pagination: '1' },
      ],
    },
    init(options) {
      // checks if there are some new options
      if (typeof options !== 'undefined') {
        for (let [key, value] of Object.entries(options)) {
          this.default[key] = value
        }
      }

      // use the default values
      this.page = this.default.page
      this.pagination = this.default.pagination

      // get all visible elements for the actual setting
      this.visible = this.getVisibleElements()

      // initialize all elements and set the not visible ones to hidden
      var elements = this.$refs[this.default.content].querySelectorAll('.' + this.default.item)
      if (elements.length === 0) {
        // if there is no default class found - use the children
        elements = this.$refs[this.default.content].children
      }
      for (let index = 0; index < elements.length; index++) {
        if (!this.visible.includes(index)) {
          elements[index].classList.add(this.default.hidden)
        }
        this.elements.push(elements[index])
      }

      // get the max height of all elements and write it to a CSS custom property
      this.$nextTick(() => {
        this.checkMaxHeight()
      })

      // event listener to re-define the height of the elements
      window.addEventListener('resize', () => {
        this.$el.style.setProperty(`--${this.default.content}-height`, '')
        this.$el.style.setProperty(`--${this.default.navigation}-height`, '')
        this.checkMaxHeight()
        this.checkWindowWidth()
        this.defineVisibleElements()
      })

      // watch animation prop if there is an animation running - hide buttons during animation
      this.$watch('animating', (value) => {
        if (value === true) {
          this.is_expand = false
          this.is_shrink = false
          this.has_next = false
          this.has_previous = false
        } else {
          this.checkExpand()
          this.checkNavigation()
        }
      })

      // define default values
      this.checkExpand()
      this.checkNavigation()
      this.checkWindowWidth()
      this.defineVisibleElements()
      this.checkLazyLoading()

      // set pagination script to initialized
      this.initialized = true
    },
    getVisibleElements() {
      // return all visible element keys for the actual setup
      var visible_elements = []
      for (let index = 0; index < this.pagination; index++) {
        var value = (this.page - 1) * this.pagination + index
        visible_elements.push(value)
      }
      return visible_elements
    },
    checkMaxHeight() {
      // get the max height of all elements in the pagination - define CSS custom property
      var element_max_height = 0
      this.elements.forEach((item) => {
        if (element_max_height < item.offsetHeight) {
          element_max_height = item.offsetHeight
        }
      })
      this.$el.style.setProperty(`--${this.default.content}-height`, `${element_max_height}px`)
      // get height of navigation and set CSS custom property
      var navigation_height = 0
      if (typeof this.$refs[this.default.navigation] !== 'undefined') {
        navigation_height = this.$refs[this.default.navigation].offsetHeight
        this.$el.style.setProperty(`--${this.default.navigation}-height`, `${navigation_height}px`)
      }
    },
    checkLazyLoading() {
      // check if there is any image usong lazy loading
      this.elements.forEach((item) => {
        var images = item.getElementsByTagName('img')
        for (let i = 0; i < images.length; i++) {
          if (typeof images[i].dataset.src === 'undefined') {
            continue
          }
          // define virtual image and load src - remove class and switch src
          var image_virtual = new Image()
          image_virtual.onload = (event) => {
            images[i].src = images[i].dataset.src
            images[i].classList.remove(this.default.lazy)
          }
          image_virtual.src = images[i].dataset.src
        }
      })
    },
    checkWindowWidth() {
      // use breakpoints to reduce the amount of elements shown on the screen
      if (this.default.breakpoints === false) return false
      var breakpoints = this.default.breakpoints

      // order breakpoints ASC
      var compare = function (a, b) {
        if (parseInt(a.width) > parseInt(b.width)) return 1
        if (parseInt(b.width) > parseInt(a.width)) return -1
        return 0
      }
      breakpoints.sort(compare)

      this.pagination = this.default.pagination
      for (let i = 0; i < breakpoints.length; i++) {
        if (window.innerWidth < parseInt(breakpoints[i].width)) {
          this.pagination = parseInt(breakpoints[i].pagination)
          break // mobile first
        }
      }
    },
    defineVisibleElements() {
      // define the default visible elements based on the settings
      this.visible = this.getVisibleElements()
      this.elements.forEach((item, index) => {
        if (!this.visible.includes(index)) {
          item.classList.add(this.default.hidden)
          item.classList.remove(this.default.visible)
        } else {
          item.classList.remove(this.default.hidden)
          item.classList.add(this.default.visible)
        }
      })
    },
    startExpand() {
      // store the actual visible elements
      var visible_old = this.visible

      // define the animation class name
      var animation_class = this.default.animation + '--expand'

      // go through all elements and if hidden -> show it
      this.elements.forEach((item, index) => {
        if (!visible_old.includes(index)) {
          item.classList.remove(this.default.hidden)
          item.classList.add(animation_class)
          this.animating = true
          item.addEventListener(
            'animationend',
            (event) => {
              event.target.classList.remove(animation_class)
              this.animating = false
              this.is_expand = true
              this.is_shrink = false
            },
            { once: true }
          )
        }
      })
    },
    startShrink() {
      this.checkWindowWidth()

      // define all visible elements for the actual setup
      this.visible = this.getVisibleElements()

      // define the animation class name
      var animation_class = this.default.animation + '--shrink'

      // go through all elements and add animation
      var counter = 0
      this.elements.forEach((item, index) => {
        if (!this.visible.includes(counter)) {
          item.classList.add(animation_class)
          this.animating = true
          item.addEventListener(
            'animationend',
            (event) => {
              this.animationEnd(event.target, 'hide', animation_class)
              this.animating = false
              this.is_shrink = true
              this.is_expand = false
            },
            { once: true }
          )
        }
        counter++
      })
    },
    startOut(direction) {
      // store the actual visible elements
      var visible_old = this.visible

      // define all visible elements for the actual setup
      this.visible = this.getVisibleElements()

      // define the animation class name
      var animation_class = this.default.animation + '--out-' + direction

      // go through all elements and add animation
      this.elements.forEach((item, index) => {
        if (visible_old.includes(index)) {
          this.animating = true
          item.classList.add(animation_class)
          item.addEventListener(
            'animationend',
            (event) => {
              this.animationEnd(event.target, 'hide', animation_class)

              this.animating = false

              // if animation has ended start the next animation
              this.startIn(direction)
            },
            { once: true }
          )
        }
      })
    },
    startIn: function (direction) {
      // define the animation class name
      var animation_class = 'pagination__anim--in-' + direction

      // go through all elements and add animation
      this.elements.forEach((item, index) => {
        if (this.visible.includes(index)) {
          item.classList.remove(this.default.hidden)
          item.classList.add(animation_class)
          this.animating = true
          item.addEventListener(
            'animationend',
            (event) => {
              this.animating = false
              this.animationEnd(event.target, 'show', animation_class)
            },
            { once: true }
          )
        }
      })
    },
    animationEnd(item, action, class_name) {
      // general function for the animationend event handler
      item.classList.remove(class_name)
      if (action === 'hide') {
        item.classList.remove(this.default.visible)
        item.classList.add(this.default.hidden)
      } else {
        item.classList.remove(this.default.hidden)
        item.classList.add(this.default.visible)
      }
    },
    checkNavigation() {
      // check all the navigation props - define it for usage in HTML
      var index = (this.page - 1) * this.pagination + this.pagination
      if (index >= this.elements.length) {
        this.has_next = false
      } else {
        this.has_next = true
      }
      if (this.page <= 1) {
        this.has_previous = false
      } else {
        this.has_previous = true
      }
    },
    checkExpand() {
      // check and define props if elements are expanded or shrinked
      if (this.pagination === this.elements.length) {
        this.is_expand = true
        this.is_shrink = false
      } else if (this.pagination >= this.elements.length) {
        this.is_expand = false
        this.is_shrink = false
      } else {
        this.is_expand = false
        this.is_shrink = true
      }
    },
    next() {
      // define next page and start animation to the right
      this.page++
      this.startOut('right')
    },
    end() {
      // define last page and start animation to the last page
      this.page = Math.ceil(this.elements.length / this.pagination)
      this.startOut('right')
    },
    previous() {
      // define next page and start animation to the left
      this.page--
      this.startOut('left')
    },
    start() {
      // define first page and start animation to the first page
      this.page = 1
      this.startOut('left')
    },
    expand() {
      // sets props to expanded
      this.page = 1
      this.pagination = this.elements.length
      this.startExpand()
    },
    shrink() {
      // sets props to shrinked and defines start page
      this.page = 1
      this.pagination = this.default.pagination
      this.startShrink()
    },
  }
}
