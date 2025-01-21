import {
    useState,
    type ChangeEvent,
    type ComponentPropsWithoutRef,
} from 'react';
import { classList } from '../../../../utils/src/class-list/class-list';
import styles from './switch.module.css';

export interface SwitchProps
    extends Omit<ComponentPropsWithoutRef<'input'>, 'defaultChecked'> {
    onCheckedChange?: (checked: boolean) => void;
}

export const Switch = ({
    children,
    checked = false,
    onCheckedChange,
    ...rest
}: SwitchProps) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        onCheckedChange?.(e.target.checked);
    };

    return (
        <label className={styles.switch}>
            <input
                {...rest}
                className={classList(
                    styles.input,
                    styles['visually-hidden'],
                    rest.className
                )}
                type="checkbox"
                role="switch"
                data-checked={isChecked}
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <span
                className={classList(
                    styles.indicator,
                    isChecked && styles.checked
                )}
            ></span>

            {children}
        </label>
    );
};
