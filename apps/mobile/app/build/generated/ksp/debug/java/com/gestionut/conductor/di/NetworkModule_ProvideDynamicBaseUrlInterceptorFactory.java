package com.gestionut.conductor.di;

import com.gestionut.conductor.data.preferences.AuthPreferences;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import okhttp3.Interceptor;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata("javax.inject.Named")
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
public final class NetworkModule_ProvideDynamicBaseUrlInterceptorFactory implements Factory<Interceptor> {
  private final Provider<AuthPreferences> authPreferencesProvider;

  public NetworkModule_ProvideDynamicBaseUrlInterceptorFactory(
      Provider<AuthPreferences> authPreferencesProvider) {
    this.authPreferencesProvider = authPreferencesProvider;
  }

  @Override
  public Interceptor get() {
    return provideDynamicBaseUrlInterceptor(authPreferencesProvider.get());
  }

  public static NetworkModule_ProvideDynamicBaseUrlInterceptorFactory create(
      Provider<AuthPreferences> authPreferencesProvider) {
    return new NetworkModule_ProvideDynamicBaseUrlInterceptorFactory(authPreferencesProvider);
  }

  public static Interceptor provideDynamicBaseUrlInterceptor(AuthPreferences authPreferences) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideDynamicBaseUrlInterceptor(authPreferences));
  }
}
