package com.gestionut.conductor.data.repository;

import com.gestionut.conductor.data.local.dao.PuntoTrackingDao;
import com.gestionut.conductor.data.preferences.AuthPreferences;
import com.gestionut.conductor.data.remote.api.ViajesApi;
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
public final class ViajeRepository_Factory implements Factory<ViajeRepository> {
  private final Provider<ViajesApi> viajesApiProvider;

  private final Provider<PuntoTrackingDao> puntoTrackingDaoProvider;

  private final Provider<AuthPreferences> authPreferencesProvider;

  public ViajeRepository_Factory(Provider<ViajesApi> viajesApiProvider,
      Provider<PuntoTrackingDao> puntoTrackingDaoProvider,
      Provider<AuthPreferences> authPreferencesProvider) {
    this.viajesApiProvider = viajesApiProvider;
    this.puntoTrackingDaoProvider = puntoTrackingDaoProvider;
    this.authPreferencesProvider = authPreferencesProvider;
  }

  @Override
  public ViajeRepository get() {
    return newInstance(viajesApiProvider.get(), puntoTrackingDaoProvider.get(), authPreferencesProvider.get());
  }

  public static ViajeRepository_Factory create(Provider<ViajesApi> viajesApiProvider,
      Provider<PuntoTrackingDao> puntoTrackingDaoProvider,
      Provider<AuthPreferences> authPreferencesProvider) {
    return new ViajeRepository_Factory(viajesApiProvider, puntoTrackingDaoProvider, authPreferencesProvider);
  }

  public static ViajeRepository newInstance(ViajesApi viajesApi, PuntoTrackingDao puntoTrackingDao,
      AuthPreferences authPreferences) {
    return new ViajeRepository(viajesApi, puntoTrackingDao, authPreferences);
  }
}
