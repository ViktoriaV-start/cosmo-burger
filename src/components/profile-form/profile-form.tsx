import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';

import { useProfileForm } from './use-profile-form';

import s from './profile-form.module.css';

export const ProfileForm = () => {
  const { name, email, password, onNameChange, onEmailChange, onPasswordChange } =
    useProfileForm();

  return (
    <form className={`${s.form} ml-15`}>
      <Input
        type="text"
        value={name}
        onChange={onNameChange}
        placeholder="Имя"
        name="name"
        icon="EditIcon"
      />
      <EmailInput
        value={email}
        onChange={onEmailChange}
        placeholder="Логин"
        name="email"
        isIcon
        extraClass="mt-6"
      />
      <PasswordInput
        value={password}
        onChange={onPasswordChange}
        name="password"
        icon="EditIcon"
        extraClass="mt-6"
      />
    </form>
  );
};
