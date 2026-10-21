package com.gestionut.conductor.data.remote;

import com.gestionut.conductor.data.preferences.AuthPreferences;
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
public final class AuthInterceptor_Factory implements Factory<AuthInterceptor> {
  private final Provider<AuthPreferences> authPreferencesProvider;

  public AuthInterceptor_Factory(Provider<AuthPreferences> authPreferencesProvider) {
    this.authPreferencesProvider = authPreferencesProvider;
  }

  @Override
  public AuthInterceptor get() {
    return newInstance(authPreferencesProvider.get());
  }

  public static AuthInterceptor_Factory create(Provider<AuthPreferences> authPreferencesProvider) {
    return new AuthInterceptor_Factory(authPreferencesProvider);
  }

  public static AuthInterceptor newInstance(AuthPreferences authPreferences) {
    return new AuthInterceptor(authPreferences);
  }
}
