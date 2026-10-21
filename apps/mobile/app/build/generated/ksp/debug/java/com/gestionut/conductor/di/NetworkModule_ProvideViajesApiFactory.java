package com.gestionut.conductor.di;

import com.gestionut.conductor.data.remote.api.ViajesApi;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import retrofit2.Retrofit;

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
public final class NetworkModule_ProvideViajesApiFactory implements Factory<ViajesApi> {
  private final Provider<Retrofit> retrofitProvider;

  public NetworkModule_ProvideViajesApiFactory(Provider<Retrofit> retrofitProvider) {
    this.retrofitProvider = retrofitProvider;
  }

  @Override
  public ViajesApi get() {
    return provideViajesApi(retrofitProvider.get());
  }

  public static NetworkModule_ProvideViajesApiFactory create(Provider<Retrofit> retrofitProvider) {
    return new NetworkModule_ProvideViajesApiFactory(retrofitProvider);
  }

  public static ViajesApi provideViajesApi(Retrofit retrofit) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideViajesApi(retrofit));
  }
}
