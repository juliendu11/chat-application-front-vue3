import Swal from 'sweetalert2'

const globalSetting = {
  customClass: {
    confirmButton: 'btn btn--primary',
    closeButton: 'btn btn--primary'
  },
  buttonsStyling: false
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const showErrorSwal = (text: string, title = 'Error!') => {
  Swal.fire({
    ...globalSetting,
    title,
    text,
    icon: 'error',
    confirmButtonText: 'Ok'
  })
}

const showSuccessSwal = (text: string, title = 'Success') => {
  Swal.fire({
    ...globalSetting,
    title,
    text,
    icon: 'success',
    confirmButtonText: 'Ok'
  })
}

const showInfoSwal = (text: string, title = '') => {
  Swal.fire({
    ...globalSetting,
    title,
    text,
    icon: 'info',
    confirmButtonText: 'Ok'
  })
}

export {
  showErrorSwal,
  showSuccessSwal,
  showInfoSwal
}
