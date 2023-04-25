import Notification from './notification'

describe('Unit test for notifications', () => {
  
  it('should create errors', () => {

    const notification = new Notification();
    const error1 = {
      message: 'error message',
      context: 'useCleanElixirTemplate'
    }

    notification.addError(error1);

    expect(notification.messages('useCleanElixirTemplate')).toBe('useCleanElixirTemplate: error message,')
    
    const error2 = {
      message: 'error message 2',
      context: 'useCleanElixirTemplate'
    }

    notification.addError(error2);

    expect(notification.messages('useCleanElixirTemplate')).toBe('useCleanElixirTemplate: error message,useCleanElixirTemplate: error message 2,')
    
    const error3 = {
      message: 'error message 3',
      context: 'useCleanPythonTemplate'
    }

    notification.addError(error3);

    expect(notification.messages('useCleanElixirTemplate')).toBe('useCleanElixirTemplate: error message,useCleanElixirTemplate: error message 2,')

    expect(notification.messages()).toBe('useCleanElixirTemplate: error message,useCleanElixirTemplate: error message 2,useCleanPythonTemplate: error message 3,')
  });

  it('should check if notification has at least one error', () => {
    const notification = new Notification();
    const error1 = {
      message: 'error message',
      context: 'useCleanElixirTemplate'
    }

    notification.addError(error1);

    expect(notification.hasErrors()).toBe(true)

  })

  it('should get all error props', () => {
    const notification = new Notification();
    const error1 = {
      message: 'error message',
      context: 'useCleanElixirTemplate'
    }

    notification.addError(error1);


    expect(notification.getErrors()).toEqual([error1])

  })
})