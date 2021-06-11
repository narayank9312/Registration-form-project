import {useState} from 'react';

const SimpleInput = (props) => {
  const [enterdName, setEnteredName] = useState('');
  const [enterdNameTouched, setEnteredNameTouched] = useState(false);
  const [enterdEmail, setEnteredEmail] = useState('');
  const [enterdEmailTouched, setEnteredEmailTouched] = useState(false);

  const enteredNameIsValid = enterdName.trim() !== '';
  const nameInputIsInvalid = !enteredNameIsValid && enterdNameTouched;

  const enterdEmailIsValid = enterdEmail.includes('@');
  const enterdEmailIsInValid = !enterdEmailIsValid && enterdEmailTouched;
  let formIsValid = false;
  if (enteredNameIsValid && enterdEmailIsInValid) {
    formIsValid = true;
  }
  // useEffect(() => {
  //   if (enteredNameIsValid) {
  //     setFormIsValid(true);
  //   } else {
  //     setFormIsValid(false);
  //   }
  // }, [enteredNameIsValid]);

  const nameInputChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };
  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const nameInputBlurHandler = () => {
    setEnteredNameTouched(true);
  };
  const emailInputBlurHandler = () => {
    setEnteredEmailTouched(true);
  };

  const formsubmissionHandler = (event) => {
    event.preventDefault();
    setEnteredNameTouched(true);
    if (!enteredNameIsValid) {
      return;
    }
    setEnteredEmail('');
    setEnteredEmailTouched(false);

    console.log(enterdName);

    setEnteredName('');
    setEnteredNameTouched(false);
  };

  const nameInputClass = nameInputIsInvalid
    ? 'form-control invalid'
    : 'form-control ';
  const emailInputClass = enterdEmailIsInValid
    ? 'form-control invalid'
    : 'form-control ';
  return (
    <form onSubmit={formsubmissionHandler}>
      <div className={nameInputClass}>
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          onBlur={nameInputBlurHandler}
          onChange={nameInputChangeHandler}
          value={enterdName}
        />
        {nameInputIsInvalid && (
          <p className="error-text">Name must not be empty</p>
        )}
      </div>
      <div className={emailInputClass}>
        <label htmlFor="email">Your E-Mail</label>
        <input
          type="email"
          id="email"
          onBlur={emailInputBlurHandler}
          onChange={emailInputChangeHandler}
          value={enterdEmail}
        />
        {enterdEmailIsInValid && (
          <p className="error-text">please enter a valid email.</p>
        )}
      </div>

      <div className="form-actions">
        <button disabled={!formIsValid}>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
