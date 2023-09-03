import { List } from '../../script/list'
import { USER_ROLE } from '../../script/user'

class UserList extends List {
  constructor() {
    super()

    this.element = document.querySelector('#user-list')
    if (!this.element) throw new Error('Element is null')

    this.loadData()
  }

  loadData = async () => {
    this.updateStatus(this.STATE.LOADING)

    try {
      const res = await fetch('/user-list-data', {
        method: 'GET',
      })

      const data = await res.json()
      // Log the received data
      console.log('Received data:', data)

      if (res.ok) {
        this.updateStatus(
          this.STATE.SUCCESS,
          this.convertData(data),
        )
      } else {
        this.updateStatus(this.STATE.ERROR, data)
      }
    } catch (error) {
      console.log(error)
      this.updateStatus(this.STATE.ERROR, {
        message: error.message,
      })
    }
  }

  convertData = (data) => {
    console.log(data)
    if (data && data.List) {
      return {
        ...data,
        list: data.List.map((item) => ({
          ...item,
          role: USER_ROLE[item.role],
        })),
      }
    }
    return data
  }

  updateView = () => {
    this.element.innerHTML = ''
    console.log(this.status, this.data)

    switch (this.status) {
      case this.STATE.LOADING:
        this.element.innerHTML = `
          <div class="user">
          <span class="user__title skeleton"></span>
          <span class="user__sub skeleton"></span>
          </div>
          <div class="user">
          <span class="user__title skeleton"></span>
          <span class="user__sub skeleton"></span>
          </div>
          <div class="user">
          <span class="user__title skeleton"></span>
          <span class="user__sub skeleton"></span>
          </div>
          <div class="user">
          <span class="user__title skeleton"></span>
          <span class="user__sub skeleton"></span>
          </div>
          `
        break
      case this.STATE.SUCCESS:
        console.log('Data received next:', this.data)
        if (this.data && this.data.list) {
          this.data.list.forEach((item) => {
            this.element.innerHTML += `
          <a href="/user-item?id=${item.id}" class="user user--click">
          <span class="user__title">${item.email}</span>
          <span class="user__sub">${item.role}</span>
          `
          })
        }
        break
      case this.STATE.ERROR:
        console.log('Error message:', this.data.message)
        if (this.data && this.data.message) {
          this.element.innerHTML = `<span class="alert alert--error">${this.data.message}</span>`
        }
        break
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    if (!window.session || !window.session.user.isConfirm) {
      location.assign('/')
    }
  } catch (err) {}

  new UserList()
})
