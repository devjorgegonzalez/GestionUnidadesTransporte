package com.gestionut.conductor.ui.screens.login;

import com.gestionut.conductor.data.preferences.AuthPreferences;
import com.gestionut.conductor.data.repository.AuthRepository;
import com.gestionut.conductor.data.repository.ViajeRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast"
})
public final class LoginReservasViewModel_Factory implements Factory<LoginReservasViewModel> {
  private final Provider<AuthRepository> authRepositoryProvider;

  private final Provider<ViajeRepository> viajeRepositoryProvider;

  private final Provider<AuthPreferences> authPreferencesProvider;

  public LoginReservasViewModel_Factory(Provider<AuthRepository> authRepositoryProvider,
      Provider<ViajeRepository> viajeRepositoryProvider,
      Provider<AuthPreferences> authPreferencesProvider) {
    this.authRepositoryProvider = authRepositoryProvider;
    this.viajeRepositoryProvider = viajeRepositoryProvider;
    this.authPreferencesProvider = authPreferencesProvider;
  }

  @Override
  public LoginReservasViewModel get() {
    return newInstance(authRepositoryProvider.get(), viajeRepositoryProvider.get(), authPreferencesProvider.get());
  }

  public static LoginReservasViewModel_Factory create(
      Provider<AuthRepository> authRepositoryProvider,
      Provider<ViajeRepository> viajeRepositoryProvider,
      Provider<AuthPreferences> authPreferencesProvider) {
    return new LoginReservasViewModel_Factory(authRepositoryProvider, viajeRepositoryProvider, authPreferencesProvider);
  }

  public static LoginReservasViewModel newInstance(AuthRepository authRepository,
      ViajeRepository viajeRepository, AuthPreferences authPreferences) {
    return new LoginReservasViewModel(authRepository, viajeRepository, authPreferences);
  }
}
