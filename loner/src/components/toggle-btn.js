import React from 'react'


const ToggleSwitch = ({ isOn, handleToggle, onColor="#0b9935"}) => {
	return (
		<>
			<input
				className="react-switch-checkbox"
				id={`react-switch-new`}
				type="checkbox"
				checked={isOn}
        		onChange={handleToggle}
			/>
			<label
				className="react-switch-label"
				htmlFor={`react-switch-new`}
				style={{ background: isOn && onColor }}
			>
			<span className={`react-switch-button`} />
			</label>
		</>
	)
}

export default ToggleSwitch