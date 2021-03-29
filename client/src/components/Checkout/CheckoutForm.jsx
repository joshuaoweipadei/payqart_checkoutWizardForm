import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import NumberFormat from 'react-number-format';
import { Stepper } from 'react-form-stepper'
import ReactDatePicker from "react-datepicker"

import "react-datepicker/dist/react-datepicker.css"

import NairaSign from '../NairaSign'

import profession from '../../images/profession.svg'

import { useStateMachine } from 'little-state-machine'
import updateAction from './updateAction'
import clearAction from "./clearAction"

import { products } from '../Product/data'
import { cartValue, downPayment, interestPayable, monthlyInstallment } from '../../helpers'
import { services } from '../../services';

const steps = [
  { label: "" },
  { label: "" },
  { label: "" },
  { label: "" }
];

const plans = [
  { title: "Aggressive", value: 1, checked: false },
  { title: "Stretching", value: 2, checked: false },
  { title: "Focused", value: 3, checked: false },
  { title: "Caval", value: 4, checked: false },
  { title: "Mild", value: 5, checked: false },
  { title: "Gentle", value: 6, checked: false },
]

const CheckoutForm = () => {
  const { handleSubmit, register, errors, control, clearErrors, reset } = useForm();
  const { actions, state } = useStateMachine({ updateAction, clearAction });
  const [ startDate, setStartDate ] = useState('');
  const [ activeStep, setActiveStep ] = useState(0);
  const [ payment, setPayment ] = useState(downPayment(products));
  const [ updatingPayment, setUpdatingPayment ] = useState(downPayment(products));
  const [ plan, setPlan ] = useState(0);
  const [ errMessage, setErrMessage ] = useState('')

  const onSubmit = (values) => {
    let shoppingCredit = cartValue(products) - payment
    // this is stopping the activeStep from increasing
    if(activeStep < 2) {
      setActiveStep(activeStep + 1);
    }
    actions.updateAction({
      ...state.data,
      ...values,
      downPayment: payment,
      shoppingCredit,
      interestPayable: interestPayable(shoppingCredit),
      monthlyInstallment: monthlyInstallment(products, plan, payment)
    });

    // Send to backend API when active step is equal to 2
    if(activeStep === 2) {
      services.order(state.data).then((res) => {
        window.alert(res.message);
        reset();  // Reset all form fields
        setActiveStep(0);  // Set active to 0
        actions.clearAction();  // Clear state data of user
      })
    }
  }

  const previousStep = (e) => {
    e.preventDefault();
    setActiveStep(activeStep - 1);
    clearErrors();
    // actions.clearAction();
  }

  const handleUpdateDownPayment = () => {
    // user updated down payment must be greater than or equal to the total item 30% down payment AND
    // user updated down payment must be less than or equal the total item value
    if(parseInt(updatingPayment) >= downPayment(products) && parseInt(updatingPayment) <= cartValue(products)) {
      setPayment(parseInt(updatingPayment));
      actions.updateAction({ downPayment: payment });
      setErrMessage("");
    } else {
      setErrMessage("Amount cannot be less than your total items Down Payment or greater than Shopping Credit");
      document.querySelector(".updateDownPayment--input").focus();
    }
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      {(activeStep > 0) &&
      <a href="#previous" onClick={(e) => previousStep(e)} className="back-link"><i className="fa fa-arrow-left" />Back</a>
      }
      <div className="stepper-container">
        <Stepper
          style={{ padding: "0 0 24px 0" }}
          steps={steps}
          activeStep={activeStep}
        />
      </div>
      {activeStep === 2 &&
      <>
        <h4>RESULTS: ready to be sent to the database</h4>
        <pre>{JSON.stringify(state, null, 2)}</pre>
        <div style={{paddingBottom: "200px"}}></div>
      </>
      }

      {(activeStep === 0) &&
      <>
      <h3 className="header-big">What do you do?</h3>
        <div className="profession">
          <div className="profession-container">
            <div className="profession-card">
              <label className="radio-profession">
                <input
                  type="radio"
                  name="profession"
                  ref={register({ required: 'Required' })}
                  className="radio--invisible"
                  value="paid-employment"
                  id="paid-employment"
                />
                <img src={profession} alt="profession" className="mmm" />
                <div className="title">paid employment</div>
              </label>
            </div>
            <div className="profession-card">
              <label className="radio-profession">
                <input
                  type="radio"
                  name="profession"
                  ref={register({ required: 'What you do is required' })}
                  className="radio--invisible"
                  value="self-employed"
                  id="self-employed"
                />
                <img src={profession} alt="profession" className="mmm" />
                <div className="title">self employed / freelance</div>
              </label>
            </div>
            <div className="profession-card">
              <label className="radio-profession">
                <input
                  type="radio"
                  name="profession"
                  ref={register({ required: 'What you do is required' })}
                  className="radio--invisible"
                  value="corporate-organization"
                  id="corporate-organization"
                />
                <img src={profession} alt="profession" className="mmm" />
                <div className="title">corporate organization</div>
              </label>
            </div>
          </div>
          <small className="isError">{errors.profession && "* "+errors.profession.message}</small>
        </div>
        
        <div className="row">
          <h3 className="header-small">How much do you get paid monthly?</h3>
          <div className="salary-amount">
            <Controller
              as={NumberFormat}
              thousandSeparator
              name="salaryAmount"
              className="input-field"
              control={control}
              rules={{ required: 'Invalid number character' }}
            />
            <span className="naira-icon naira-sign">N</span>
            <small className="isError">{errors.salaryAmount && "* "+errors.salaryAmount.message}</small>
          </div>
        </div>

        <div className="row">
          <h3 className="header-small">When is your next salary date?</h3>
          <div className="salary-amount">
            <Controller
              rules={{ required: 'Next salary date is required' }}
              as={ReactDatePicker}
              control={control}
              selected={startDate}
              onSelect={date => setStartDate(date)}
              onChange={([selected]) => selected}
              minDate={Date.now()}
              dateFormat="dd/MM/yyyy"
              name="salaryDate"
              className={errors.salaryDate && errors.salaryDate.message ? 'input-field-controller focus' : 'input-field-controller'}
              placeholderText="Select pay date"
            />
            <span className="date"><i className="fa fa-calendar"/></span>
            <small className="isError">{errors.salaryDate && "* "+errors.salaryDate.message}</small>
          </div>
        </div>
        
        <div className="row">
          <h3 className="header-small">Do you have any existing loan(s)?</h3>
          <div className="existing-loan-radio">
            <label className="radio-group">
              <input
                type="radio"
                name="existingLoan"
                id="yes"
                value="Yes"
                ref={register({ required: 'Indicate if you are on any existing loan' })}
              />Yes
              <span className="checkround" />
            </label>
            <hr/>
            <label className="radio-group">
              <input
                type="radio"
                name="existingLoan"
                id="no"
                value="No"
                ref={register({ required: 'Indicate if you are on any existing loan' })}
              />No
              <span className="checkround" />
            </label>
          </div>
          <small className="isError">{errors.existingLoan && "* "+errors.existingLoan.message}</small>
        </div>
        </>
      }

      {(activeStep === 1) &&
      <>
      <div className="monthly-plan">
        <h3 className="header-big">Choose Your Plan?</h3>
        <div className="monthly-plan-container">
          {plans.map(plan => 
            <label key={plan.value} className="plan-card-radio">
              <input
                type="radio"
                name="monthlyPlan"
                value={plan.value}
                ref={register({ required: 'Choose your plan' })}
                onChange={(e) => setPlan(e.target.value)}
              />
              <div className="plan-card-wrapper">
                <div className="plan-card-content">
                  <div className="plan-title">{plan.title}</div>
                  <h1 className="plan-number">{plan.value}</h1>
                  <div className="month">month</div>
                </div>
              </div>
            </label>
          )}
        </div>
        <small className="isError">{errors.monthlyPlan && "* "+errors.monthlyPlan.message}</small>
      </div>

      <div className="payment-breakdown">
        <h3 className="header-big">Payment Breakdown</h3>
        <div className="payment-breakdown-container">
          <div className="breakdown-items">
            <table>
              <tbody>
                <tr>
                  <td>Shopping Credit</td>
                  <td>
                    <NairaSign />
                    <NumberFormat
                      value={cartValue(products) - payment}
                      displayType="text"
                      thousandSeparator
                      decimalScale={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Down Payment</td>
                  <td>
                    <NairaSign />
                    <NumberFormat
                      value={payment}
                      displayType="text"
                      thousandSeparator
                      decimalScale={2}
                      isNumericString
                    />
                  </td>
                </tr>
                <tr>
                  <td>Monthly Installment {plan === 0 && <small className="isError">*</small>}</td>
                  <td>
                  {plan > 0 &&
                    <>
                      <NairaSign />
                      <NumberFormat
                        value={monthlyInstallment(products, plan, payment)}
                        displayType="text"
                        thousandSeparator
                        decimalScale={2}
                      />
                    </>
                    }
                  </td>
                </tr>
                <tr>
                  <td>Tenure {plan === 0 && <small className="isError">*</small>}</td>
                  <td>{plan > 1 ? plan+" months" : plan+" month"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="update-breakdown-total">
            <div>
              <div className="title">
                Customize <br/> Down Payment
              </div>
              <div className="customize-down-payment">
                <NumberFormat
                  value={updatingPayment}
                  thousandSeparator
                  decimalScale={2}
                  className="updateDownPayment--input"
                  onValueChange={(values) => setUpdatingPayment(values.value)}
                />
                <span className="naira-sign">N</span>
              </div>
              {errMessage && <small className="isError--reverse"> {errMessage} </small>}
            </div>
            <button type="button" onClick={handleUpdateDownPayment} className="update-btn">
              {parseInt(updatingPayment) === payment
              ? "Update Breakdown"
              : "Save Breakdown"
              }
            </button>
          </div>
        </div>
      </div>
      </>
      }

      <div className="continue">
        <button type="submit" className="submit-btn">{activeStep === 2 ? "Submit" : "Continue"}</button>
      </div>
    </form>
    </>
  )
}

export default (CheckoutForm)