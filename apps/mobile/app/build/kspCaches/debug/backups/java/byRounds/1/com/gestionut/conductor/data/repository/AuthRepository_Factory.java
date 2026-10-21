package com.gestionut.conductor.data.repository;

import com.gestionut.conductor.data.preferences.AuthPreferences;
import com.gestionut.conductor.data.remote.api.AuthApi;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
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
public final class AuthRepository_Factory implements Factory<AuthRepository> {
  private final Provider<AuthApi> authApiProvider;

  private final Provider<AuthPreferences> authPreferencesProvider;

  public AuthRepository_Factory(Provider<AuthApi> authApiProvider,
      Provider<AuthPreferences> authPreferencesProvider) {
    this.authApiProvider = authApiProvider;
    this.authPreferencesProvider = authPreferencesProvider;
  }

  @Override
  public AuthRepository get() {
    return newInstance(authApiProvider.get(), authPreferencesProvider.get());
  }

  public static AuthRepository_Factory create(Provider<AuthApi> authApiProvider,
      Provider<AuthPreferences> authPreferencesProvider) {
    return new AuthRepository_Factory(authApiProvider, authPreferencesProvider);
  }

  public static AuthRepository newInstance(AuthApi authApi, AuthPreferences authPreferences) {
    return new AuthRepository(authApi, authPreferences);
  }
}
